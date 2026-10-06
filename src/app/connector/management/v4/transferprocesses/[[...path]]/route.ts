import { getConnectorConfig } from "@/utilities/connector-config";
import {
  buildUrl,
  createSanitizedProxyRequest,
  proxyDelete,
  proxyHead,
  proxyPost,
  proxyPut,
  stripDataDestination,
} from "@/utilities/proxy";
import { NextRequest, NextResponse } from "next/server";

// The destination address can hold credentials, so it never reaches the browser.
const handleGet = async (req: NextRequest): Promise<NextResponse> => {
  const config = getConnectorConfig();
  return createSanitizedProxyRequest(
    buildUrl(req),
    "GET",
    config.apiKey,
    stripDataDestination,
  );
};

const handlePost = async (req: NextRequest): Promise<NextResponse> => {
  const { pathname } = req.nextUrl;
  const pathAfterTransferprocesses = pathname
    .split("/transferprocesses")[1]
    ?.replace(/^\//, "");

  if (pathAfterTransferprocesses !== "request") {
    return proxyPost(req);
  }

  const config = getConnectorConfig();
  return createSanitizedProxyRequest(
    buildUrl(req),
    "POST",
    config.apiKey,
    stripDataDestination,
    await req.text(),
  );
};

export const GET = handleGet;
export const POST = handlePost;
export const DELETE = proxyDelete;
export const PUT = proxyPut;
export const HEAD = proxyHead;
