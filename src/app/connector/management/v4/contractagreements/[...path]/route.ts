import {
  queryEnrichedContractAgreements,
  UnsupportedOperatorError,
} from "@/server/contract-agreement-enrichment";
import {
  proxyDelete,
  proxyGet,
  proxyHead,
  proxyPost,
  proxyPut,
} from "@/server/proxy";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
  QuerySpec,
} from "@think-it-labs/edc-connector-client";
import { NextRequest, NextResponse } from "next/server";

const EDC_ERROR_STATUS: Partial<Record<EdcConnectorClientErrorType, number>> = {
  [EdcConnectorClientErrorType.BadRequest]: 400,
  [EdcConnectorClientErrorType.NotFound]: 404,
  [EdcConnectorClientErrorType.Duplicate]: 409,
  [EdcConnectorClientErrorType.BadGateway]: 502,
  [EdcConnectorClientErrorType.Unreachable]: 502,
};

const handlePost = async (req: NextRequest): Promise<NextResponse> => {
  const { pathname } = req.nextUrl;
  const pathParam = pathname.split("/contractagreements")[1] || "";

  if (pathParam.startsWith("/retirements")) {
    return proxyPost(req);
  }

  let body: QuerySpec;
  try {
    body = (await req.json()) as QuerySpec;
  } catch {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return new NextResponse("Invalid request body", { status: 400 });
  }

  try {
    const result = await queryEnrichedContractAgreements(body);
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    if (error instanceof UnsupportedOperatorError) {
      return new NextResponse(error.message, { status: 501 });
    }
    if (error instanceof EdcConnectorClientError) {
      const status = EDC_ERROR_STATUS[error.type];
      if (status) {
        return new NextResponse(error.message, { status });
      }
    }
    console.error("Error in contract agreements query:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = proxyGet;
export const POST = handlePost;
export const DELETE = proxyDelete;
export const PUT = proxyPut;
export const HEAD = proxyHead;
