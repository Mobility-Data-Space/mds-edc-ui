import { proxyConnectorManagement } from "@/constants/proxy";
import { EdcConnectorClient } from "@think-it-labs/edc-connector-client";
import { NextRequest, NextResponse } from "next/server";

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

const MAX_RETRIES = 5;

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

function generateDatePrefix(): string {
  const prefix = "mds-data-offer-";
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${prefix}${day}${month}${year}`;
}

async function getNextSequenceNumber(datePrefix: string): Promise<number> {
  const existingTodayContracts =
    await client.management.contractDefinitions.queryAll({
      offset: 0,
      limit: 1000,
      filterExpression: [
        {
          operandLeft: "id",
          operator: "like",
          operandRight: `${datePrefix}_%`,
        },
      ],
      sortField: "createdAt",
      sortOrder: "DESC",
    });

  const existingIds = existingTodayContracts.map((contract) => contract["@id"]);

  const maxUid = existingIds
    .filter((id) => id.startsWith(`${datePrefix}_`))
    .map((id) => {
      const uidPart = id.substring(`${datePrefix}_`.length);
      return parseInt(uidPart, 10);
    })
    .filter((uid) => !isNaN(uid))
    .reduce((max, uid) => Math.max(max, uid), 0);

  return maxUid + 1;
}

interface ContractDefinitionBody {
  "@id"?: string;
  accessPolicyId: string;
  contractPolicyId: string;
  assetsSelector: unknown[];
  privateProperties?: Record<string, unknown>;
}

async function createContractDefinitionWithRetry(
  body: ContractDefinitionBody,
): Promise<NextResponse> {
  const datePrefix = generateDatePrefix();

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const sequenceNumber = await getNextSequenceNumber(datePrefix);
    const contractId = `${datePrefix}_${sequenceNumber}`;

    const contractDefinition = {
      ...body,
      "@id": contractId,
    };

    console.log(contractDefinition);

    const url = `${connectorManagementUrl()}/v3/contractdefinitions`;
    const proxy = await fetchProxy(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": connectorApiKey(),
      },
      body: JSON.stringify(contractDefinition),
    });

    if (proxy.status === 409) {
      console.log(
        `Contract ID ${contractId} already exists, retrying (attempt ${attempt + 1}/${MAX_RETRIES})`,
      );
      continue;
    }

    const readableStream = proxy.body;
    const response = new NextResponse(readableStream, { status: proxy.status });
    setResponseHeaders(proxy, response);
    return response;
  }

  return NextResponse.json(
    {
      message: `Failed to create contract definition after ${MAX_RETRIES} attempts due to ID conflicts`,
      type: "RetryExhausted",
    },
    { status: 500 },
  );
}

const handleContractDefinitionCreate = async (
  req: NextRequest,
): Promise<NextResponse> => {
  try {
    const body = (await req.json()) as ContractDefinitionBody;

    // if id is provided use it directly
    if (body["@id"]) {
      const url = buildUrl(req);
      return createProxyRequest(url, "POST", JSON.stringify(body));
    }

    // no id provided >> use retry logic
    return createContractDefinitionWithRetry(body);
  } catch (error) {
    console.error("Error in contract definition creation:", error);
    return NextResponse.json(
      { message: "Internal server error", type: "InternalError" },
      { status: 500 },
    );
  }
};

const handlePost = async (req: NextRequest): Promise<NextResponse> => {
  const { pathname } = req.nextUrl;
  const pathAfterContractdefinitions = pathname
    .split("/contractdefinitions")[1]
    ?.replace(/^\//, "");

  // POST to /contractdefinitions >> intercept and generate id
  if (!pathAfterContractdefinitions) {
    return handleContractDefinitionCreate(req);
  }

  const url = buildUrl(req);
  const requestBody = await req.text();
  return createProxyRequest(url, "POST", requestBody);
};

const handleGet = async (req: NextRequest): Promise<NextResponse> => {
  const url = buildUrl(req);
  return createProxyRequest(url, "GET");
};

const handlePut = async (req: NextRequest): Promise<NextResponse> => {
  const url = buildUrl(req);
  const requestBody = await req.text();
  return createProxyRequest(url, "PUT", requestBody);
};

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

const handleDefault = async (): Promise<NextResponse> => {
  return NextResponse.json(null, { status: 200 });
};

export const GET = handleGet;
export const POST = handlePost;
export const DELETE = handleDelete;
export const PUT = handlePut;
export const HEAD = handleDefault;
