import { CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS } from "@/constants/contract-agreement";
import { proxyConnectorManagement } from "@/constants/proxy";
import { STATE_RUNNING } from "@/constants/transfer-process";
import { ASSET_TITLE } from "@/jsonld/asset";
import { EnrichedContractAgreement } from "@/types/enriched-contract-agreement";
import { cache } from "@/utilities/cache";
import {
  AGREEMENT_RETIREMENT_DATE,
  AGREEMENT_RETIREMENT_REASON,
  AgreementsRetirementController,
  RetiredContractAgreement,
} from "@/utilities/contract-agreement";
import { operatorIn } from "@/utilities/data-offer";
import {
  Asset,
  Catalog,
  ContractAgreement,
  CriterionInput,
  EdcConnectorClient,
  expand,
  QuerySpec,
  TransferProcessStates,
} from "@think-it-labs/edc-connector-client";
import { NextRequest, NextResponse } from "next/server";

// TODO: to be moved
function connectorApiKey() {
  return process.env.EDC_MANAGEMENT_API_KEY || "";
}

function connectorManagementUrl() {
  return process.env.EDC_MANAGEMENT_URL || "";
}

function connectorId() {
  if (!process.env.EDC_ID) throw new Error("Connector ID is missing");
  return process.env.EDC_ID;
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
  retiredContractAgreementMap: Map<string, RetiredContractAgreement>,
  contractAgreementInfo: Record<string, ContractAgreementInfo>,
  assetTitleMap: Map<string, string>,
) => {
  return expand(
    {
      ...contractAgreement,
      [CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS.IS_TERMINATED]:
        retiredContractAgreementMap.has(contractAgreement.id) || false,
      [CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS.IS_RUNNING]:
        contractAgreementInfo[contractAgreement.id]?.isRunning || false,
      [CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS.TRANSFER_COUNT]:
        contractAgreementInfo[contractAgreement.id]?.transfersCount || 0,
      [CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS.IS_TERMINATED_AT]:
        contractAgreementInfo[contractAgreement.id]?.isTerminatedAt ||
        retiredContractAgreementMap.get(contractAgreement.id)?.[
          AGREEMENT_RETIREMENT_DATE
        ] ||
        0,
      [CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS.TERMINATION_REASON]:
        contractAgreementInfo[contractAgreement.id]?.retirementReason ||
        retiredContractAgreementMap.get(contractAgreement.id)?.[
          AGREEMENT_RETIREMENT_REASON
        ] ||
        "",
      [CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS.ASSET_TITLE]:
        assetTitleMap.get(contractAgreement.assetId) || null,
    },
    () => new EnrichedContractAgreement(),
  );
};

const shouldIncludeAgreement = (
  contractAgreement: EnrichedContractAgreement,
  statusFilter: CriterionInput | null,
) => {
  //NOTE: this is inefficient and should be replace when this is closed https://github.com/eclipse-edc/Connector/issues/5132
  if (statusFilter && !statusFilter.operandRight) {
    return !contractAgreement.isTerminated;
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

    // should fetch only the needed ones
    const transferProcesses =
      await client.management.transferProcesses.queryAll({
        offset: 0,
        limit: 10000,
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
    if (
      statusFilter &&
      statusFilter.operandRight === true &&
      retiredAgreements.length
    ) {
      body.filterExpression?.push({
        operandLeft: "id",
        operator: operatorIn.value,
        operandRight: retiredContractAgreementIds,
      });
    }

    const contractAgreements =
      await client.management.contractAgreements.queryAll(body);

    let assets: Asset[] = [];

    if (contractAgreements.length)
      assets = await client.management.assets.queryAll({
        limit: 100,
        offset: 0,
        filterExpression: [
          {
            operandLeft: "id",
            operator: "in",
            operandRight: contractAgreements.map(
              (contractAgreement) => contractAgreement.assetId,
            ),
          },
        ],
      });

    const assetIdTitleMap = new Map(
      assets.map((asset) => [
        asset.id,
        asset.properties[ASSET_TITLE][0]["@value"],
      ]),
    );

    const finalContractAgreements = (
      await Promise.all(
        contractAgreements.map((agreement) =>
          enrichContractAgreement(
            agreement,
            retiredAgreementToIdMap,
            contractAgreementInfo,
            assetIdTitleMap,
          ),
        ),
      )
    ).filter((agreement) => shouldIncludeAgreement(agreement, statusFilter));

    // get contracts with no asset title
    const foreignContracts = contractAgreements.filter(
      (ca) => ca.providerId !== connectorId(),
    );
    // group assets by connector id
    const connectorContractsMap = Map.groupBy(
      foreignContracts,
      (ca) => ca.providerId,
    );
    // fetch connector dsp
    const dsps = await Promise.all(
      Array.from(connectorContractsMap, async ([connectorId, cas]) => [
        connectorId,
        await cache.get(
          connectorId,
          async () =>
            (
              await client.management.contractAgreements.getNegotiation(
                cas[0].id,
              )
            ).optionalValue("edc", "counterPartyAddress") as string,
        ),
      ]),
    );
    // fetch the asset titles using the dsp
    const assetsConnectorMap = await Promise.all(
      dsps.map(async ([connectorId, dsp]): Promise<[string, Catalog]> => {
        return [
          connectorId,
          await client.management.catalog.request({
            counterPartyAddress: dsp,
            querySpec: {
              limit: 1000,
              offset: 0,
              filterExpression: [
                {
                  operandLeft: "id",
                  operator: "in",
                  operandRight: connectorContractsMap
                    .get(connectorId)
                    ?.map((ca) => ca.assetId),
                },
              ],
            },
          }),
        ];
      }),
    );

    const catalogConnectorMap = new Map(
      assetsConnectorMap.flatMap(([connectorId, catalog]) => {
        return catalog.datasets.map((dataset) => {
          return [
            `${connectorId}-${dataset.id}`,
            dataset["http://purl.org/dc/terms/title"]?.[0]?.["@value"] as
              | string
              | undefined,
          ];
        });
      }),
    );

    // enrich all the contracts
    const result = finalContractAgreements.map((ca) => {
      if (!ca.assetTitle) {
        ca.setValue(
          "edc",
          "assetTitle",
          catalogConnectorMap.get(`${ca.providerId}-${ca.assetId}`) || null,
        );
      }
      return ca;
    });

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
