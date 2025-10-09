import { proxyConnectorManagement } from "@/constants/proxy";
import { STATE_RUNNING } from "@/constants/transfer-process";
import {
  AGREEMENT_RETIREMENT_DATE,
  AGREEMENT_RETIREMENT_REASON,
  AgreementsRetirementController,
} from "@/utilities/contract-agreement";
import { operatorIn } from "@/utilities/data-offer";
import {
  ContractAgreement,
  CriterionInput,
  EdcConnectorClient,
  QuerySpec,
  TransferProcessStates,
} from "@think-it-labs/edc-connector-client";
import { NextRequest, NextResponse } from "next/server";

const EDC_NAMESPACE = {
  IS_TERMINATED: "https://w3id.org/edc/v0.0.1/ns/isTerminated",
  IS_RUNNING: "https://w3id.org/edc/v0.0.1/ns/isRunning",
  TRANSFER_COUNT: "https://w3id.org/edc/v0.0.1/ns/transferCount",
  IS_TERMINATED_AT: "https://w3id.org/edc/v0.0.1/ns/isTerminatedAt",
  RETIREMENT_REASON: "https://w3id.org/edc/v0.0.1/ns/terminatedReason",
} as const;

// TODO: to be moved
function connectorApiKey() {
  return process.env.EDC_MANAGEMENT_API_KEY || "";
}

function connectorManagementUrl() {
  return process.env.EDC_MANAGEMENT_URL || "";
}

const client = new EdcConnectorClient.Builder()
  .apiToken(connectorApiKey())
  .managementUrl(connectorManagementUrl())
  .build();

const getAgreementsRetirementController = () => {
  const newURL = new URL(proxyConnectorManagement, process.env.APP_URL).href;
  return new AgreementsRetirementController(newURL);
};

// Utility functions for contract agreement processing
const enrichContractAgreement = (
  contractAgreement: ContractAgreement,
  retiredContractAgreementIds: string[],
  contractAgreementInfo: Record<string, ContractAgreementInfo>,
) => {
  return {
    ...contractAgreement,
    [EDC_NAMESPACE.IS_TERMINATED]:
      retiredContractAgreementIds.includes(contractAgreement.id) || false,
    [EDC_NAMESPACE.IS_RUNNING]:
      contractAgreementInfo[contractAgreement.id]?.isRunning || false,
    [EDC_NAMESPACE.TRANSFER_COUNT]:
      contractAgreementInfo[contractAgreement.id]?.transfersCount || 0,
    [EDC_NAMESPACE.IS_TERMINATED_AT]:
      contractAgreementInfo[contractAgreement.id]?.isTerminatedAt || 0,
    [EDC_NAMESPACE.RETIREMENT_REASON]:
      contractAgreementInfo[contractAgreement.id]?.retirementReason || "",
  };
};

const shouldIncludeAgreement = (
  contractAgreement: {
    "https://w3id.org/edc/v0.0.1/ns/isTerminated": boolean;
    "https://w3id.org/edc/v0.0.1/ns/isRunning": boolean;
    "https://w3id.org/edc/v0.0.1/ns/transferCount": number;
    "@id": string;
  },
  statusFilter: CriterionInput | null,
) => {
  //NOTE: this is inefficient and should be replace when this is closed https://github.com/eclipse-edc/Connector/issues/5132
  if (statusFilter && !statusFilter.operandRight) {
    return !contractAgreement[EDC_NAMESPACE.IS_TERMINATED];
  }
  return true;
};

const createProxyRequest = async (
  url: string,
  method: string,
  body?: string,
): Promise<NextResponse> => {
  const proxy = await fetchProxy(url, {
    method,
    headers: {
      ...(body && { "content-type": "application/json" }),
      "x-api-key": connectorApiKey(),
    },
    credentials: "same-origin",
    body: body && body !== "{}" ? body : undefined,
  });

  const readableStream = proxy.body;
  const response = new NextResponse(readableStream, { status: proxy.status });
  setResponseHeaders(proxy, response);

  return response;
};

const handleRetirementProxy = async (
  req: NextRequest,
): Promise<NextResponse> => {
  try {
    const url = buildUrl(req);
    const requestBody = await req.text();
    return createProxyRequest(url, "POST", requestBody);
  } catch (error) {
    console.error("Error in retirement proxy:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

const handleContractAgreementsQuery = async (
  req: NextRequest,
): Promise<NextResponse> => {
  try {
    const body = (await req.json()) as QuerySpec;

    if (!body || typeof body !== "object") {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    const statusFilterIndex = body.filterExpression?.findIndex(
      (filterExpression) => filterExpression.operandLeft === "isTerminated",
    );

    let statusFilter: CriterionInput | null = null;

    if (statusFilterIndex !== undefined && statusFilterIndex !== -1) {
      statusFilter = body.filterExpression?.splice(statusFilterIndex, 1)[0]!;
    }

    // Don't use optional chaining here, statusFilter needs to exist first
    if (statusFilter && statusFilter.operator !== "=") {
      return new NextResponse(
        `Operator ${statusFilter?.operator} not supported`,
        { status: 501 },
      );
    }

    const retiredAgreementsController = getAgreementsRetirementController();
    const retiredAgreements =
      await retiredAgreementsController.retiredAgreementsRequest();

    const retiredAgreementToIdMap = new Map(
      retiredAgreements.map(
        (retiredAgreement) =>
          [retiredAgreement.agreementId, retiredAgreement] as const,
      ),
    );

    const transferProcesses =
      await client.management.transferProcesses.queryAll({
        offset: 0,
        limit: 100,
      });

    const contractAgreementInfoToIdMap = transferProcesses.reduce(
      (acc, transferProcess) => {
        const contractAgreementId = transferProcess.contractId;
        const existingInfo = acc.get(contractAgreementId);
        const retiredContractAgreement =
          retiredAgreementToIdMap.get(contractAgreementId);

        if (existingInfo) {
          return acc.set(contractAgreementId, {
            ...existingInfo,
            transfersCount: existingInfo.transfersCount + 1,
            isRunning:
              existingInfo.isRunning || transferProcess.state === STATE_RUNNING,
          });
        }

        return acc.set(contractAgreementId, {
          isTerminated: retiredAgreementToIdMap.has(contractAgreementId),
          isRunning:
            transferProcess.state !== TransferProcessStates.TERMINATED &&
            transferProcess.state === STATE_RUNNING,
          isTerminatedAt:
            (retiredContractAgreement?.[AGREEMENT_RETIREMENT_DATE] as number) ??
            0,
          retirementReason:
            (retiredContractAgreement?.[
              AGREEMENT_RETIREMENT_REASON
            ] as string) ?? "",
          transfersCount: 1,
        });
      },
      new Map<string, ContractAgreementInfo>(),
    );

    const contractAgreementInfo = Object.fromEntries(
      contractAgreementInfoToIdMap,
    );
    const retiredContractAgreementIds = Array.from(
      retiredAgreementToIdMap.keys(),
    );

    // NOTE: has to specificly be true
    if (statusFilter && statusFilter.operandRight === true) {
      body.filterExpression?.push({
        operandLeft: "id",
        operator: operatorIn.value,
        operandRight: retiredContractAgreementIds,
      });
    }

    const contractAgreements =
      await client.management.contractAgreements.queryAll(body);

    const result = contractAgreements
      .map((agreement) =>
        enrichContractAgreement(
          agreement,
          retiredContractAgreementIds,
          contractAgreementInfo,
        ),
      )
      .filter((agreement) => shouldIncludeAgreement(agreement, statusFilter));

    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error in contract agreements query:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

const handlePost = async (req: NextRequest): Promise<NextResponse> => {
  const { pathname } = req.nextUrl;
  const pathParam = pathname.split("/contractagreements")[1] || "";

  if (pathParam.startsWith("/retirements")) {
    return handleRetirementProxy(req);
  }

  return handleContractAgreementsQuery(req);
};

const buildUrl = (req: NextRequest): string => {
  const connectorManagementUrlValue = process.env.EDC_MANAGEMENT_URL || "";
  return (
    connectorManagementUrlValue +
    req.nextUrl.pathname.replace(proxyConnectorManagement, "")
  );
};

const fetchProxy = async (
  url: string,
  options: RequestInit,
): Promise<Response> => {
  return await fetch(url, options);
};

const setResponseHeaders = (proxy: Response, response: NextResponse): void => {
  const contentType = proxy.headers.get("content-type");
  if (contentType) {
    response.headers.set("content-type", contentType);
  }
};

// Handler for GET requests
const handleGet = async (req: NextRequest): Promise<NextResponse> => {
  const url = buildUrl(req);
  return createProxyRequest(url, "GET");
};

// Handler for PUT requests
const handlePut = async (req: NextRequest): Promise<NextResponse> => {
  const url = buildUrl(req);
  const requestBody = await req.text();
  return createProxyRequest(url, "PUT", requestBody);
};

// Handler for DELETE requests
const handleDelete = async (req: NextRequest): Promise<NextResponse> => {
  const url = buildUrl(req);
  const proxy = await fetchProxy(url, {
    method: "DELETE",
    headers: {
      "x-api-key": connectorApiKey(),
    },
  });

  return new NextResponse(null, { status: proxy.status });
};

// Default handler for unsupported methods
const handleDefault = async (): Promise<NextResponse> => {
  return NextResponse.json(null, { status: 200 });
};

// Export handlers for each HTTP method
export const GET = handleGet;
export const POST = handlePost;
export const DELETE = handleDelete;
export const PUT = handlePut;
export const HEAD = handleDefault;
