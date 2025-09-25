import { proxyConnectorManagement } from "@/constants/proxy";
import { STATE_RUNNING } from "@/constants/transfer-process";
import {
  AGREEMENT_RETIREMENT_DATE,
  AGREEMENT_RETIREMENT_REASON,
  AgreementsRetirementController,
} from "@/utilities/contract-agreement";
import { operatorIn } from "@/utilities/data-offer";
import {
  CriterionInput,
  EdcConnectorClient,
  QuerySpec,
  TransferProcessStates,
} from "@think-it-labs/edc-connector-client";
import { NextRequest, NextResponse } from "next/server";

// TODO: to be moved
function connectorApiKey() {
  return process.env.EDC_MANAGEMENT_API_KEY || "";
}

function connectorManagmentUrl() {
  return process.env.EDC_MANAGEMENT_URL || "";
}

const client = new EdcConnectorClient.Builder()
  .apiToken(connectorApiKey())
  .managementUrl(connectorManagmentUrl())
  .build();

const getAgreementsRetirementController = () => {
  const newURL = new URL(proxyConnectorManagement, process.env.APP_URL).href;
  return new AgreementsRetirementController(newURL);
};

const handlePost = async (req: NextRequest): Promise<NextResponse> => {
  const { pathname } = req.nextUrl;
  const pathParam = pathname.split("/contractagreements")[1] || "";

  if (pathParam.startsWith("/retirements")) {
    const url = buildUrl(req);
    const requestBody = await req.text();

    const proxy = await fetchProxy(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": connectorApiKey(),
      },
      credentials: "same-origin",
      body: requestBody && requestBody !== "{}" ? requestBody : undefined,
    });

    const readableStream = proxy.body;
    const response = new NextResponse(readableStream, { status: proxy.status });
    setResponseHeaders(proxy, response);

    return response;
  }

  const body = (await req.json()) as QuerySpec;

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

  const agreementsRetirementController = getAgreementsRetirementController();
  const retiredAgreements =
    await agreementsRetirementController.retiredAgreementsRequest();

  const retiredContractAgreementsToSave = new Map(
    retiredAgreements.map(
      (retiredAgreement) =>
        [retiredAgreement.agreementId, retiredAgreement] as const,
    ),
  );

  const transferProcesses = await client.management.transferProcesses.queryAll({
    offset: 0,
  });

  const contractAgreementInfoToSave = new Map<string, ContractAgreementInfo>();

  transferProcesses.forEach((transferProcess) => {
    const contractAgreementId = transferProcess.contractId;
    const contractAgreement =
      contractAgreementInfoToSave.get(contractAgreementId);

    if (contractAgreement) {
      contractAgreement.transfersCount++;

      if (contractAgreement.isRunning !== true) {
        contractAgreement.isRunning = transferProcess.state === STATE_RUNNING;
      }
    } else {
      const retiredContractAgreement =
        retiredContractAgreementsToSave.get(contractAgreementId);

      if (retiredContractAgreement) {
        contractAgreementInfoToSave.set(contractAgreementId, {
          isTerminated:
            retiredContractAgreementsToSave.has(contractAgreementId),
          isRunning:
            transferProcess.state !== TransferProcessStates.TERMINATED &&
            transferProcess.state === STATE_RUNNING,
          isTerminatedAt: retiredContractAgreement[
            AGREEMENT_RETIREMENT_DATE
          ] as number,
          retirementReason: retiredContractAgreement[
            AGREEMENT_RETIREMENT_REASON
          ] as string,
          transfersCount: 1,
        });
      }
    }
  });

  const contractAgreementInfo = Object.fromEntries(contractAgreementInfoToSave);
  const retiredContractAgreementIds = Array.from(
    retiredContractAgreementsToSave.keys(),
  );

  if (statusFilter && statusFilter.operandRight) {
    body.filterExpression?.push({
      operandLeft: "id",
      operator: operatorIn.value,
      operandRight: retiredContractAgreementIds,
    });
  }

  const contractAgreements =
    await client.management.contractAgreements.queryAll(body);

  const result = contractAgreements
    .map((contractAgreement) => {
      return {
        ...contractAgreement,

        "https://w3id.org/edc/v0.0.1/ns/isTerminated":
          retiredContractAgreementIds.includes(contractAgreement.id) || false,
        "https://w3id.org/edc/v0.0.1/ns/isRunning":
          contractAgreementInfo[contractAgreement.id]?.isRunning || false,
        "https://w3id.org/edc/v0.0.1/ns/transferCount":
          contractAgreementInfo[contractAgreement.id]?.transfersCount || 0,
      };
    })
    .filter((contractAgreement) => {
      if (statusFilter && !statusFilter.operandRight) {
        return !contractAgreement[
          "https://w3id.org/edc/v0.0.1/ns/isTerminated"
        ];
      }
      return true;
    });

  return new NextResponse(JSON.stringify(result), { status: 200 });
};

const buildUrl = (req: NextRequest): string => {
  const connectorManagementUrl = process.env.EDC_MANAGEMENT_URL || "";
  return (
    connectorManagementUrl +
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
  const proxy = await fetchProxy(url, {
    method: "GET",
    headers: {
      "x-api-key": connectorApiKey(),
    },
  });

  const readableStream = proxy.body;
  const response = new NextResponse(readableStream, { status: proxy.status });
  setResponseHeaders(proxy, response);

  return response;
};

// Handler for PUT requests
const handlePut = async (req: NextRequest): Promise<NextResponse> => {
  const url = buildUrl(req);
  const requestBody = await req.text();

  const proxy = await fetchProxy(url, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "x-api-key": connectorApiKey(),
    },
    credentials: "same-origin",
    body: requestBody && requestBody !== "{}" ? requestBody : undefined,
  });

  const readableStream = proxy.body;
  const response = new NextResponse(readableStream, { status: proxy.status });
  setResponseHeaders(proxy, response);

  return response;
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
