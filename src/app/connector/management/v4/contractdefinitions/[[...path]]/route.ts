import { getConnectorConfig } from "@/utilities/connector-config";
import {
  ContractDefinitionBody,
  createContractDefinitionWithRetry,
} from "@/utilities/contract-definition-creation";
import {
  buildUrl,
  createProxyRequest,
  proxyDelete,
  proxyGet,
  proxyHead,
  proxyPost,
  proxyPut,
} from "@/utilities/proxy";
import { NextRequest, NextResponse } from "next/server";

const handleContractDefinitionCreate = async (
  req: NextRequest,
): Promise<NextResponse> => {
  const config = getConnectorConfig();
  try {
    const body = (await req.json()) as ContractDefinitionBody;

    // if id is provided use it directly
    if (body["@id"]) {
      const url = buildUrl(req);
      return createProxyRequest(
        url,
        "POST",
        config.apiKey,
        JSON.stringify(body),
      );
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

  return proxyPost(req);
};

export const GET = proxyGet;
export const POST = handlePost;
export const DELETE = proxyDelete;
export const PUT = proxyPut;
export const HEAD = proxyHead;
