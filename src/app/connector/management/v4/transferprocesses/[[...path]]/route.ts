// Transfer processes are served on v4 (issues #716, #735). The data destination
// can hold credentials, so it is stripped here and never reaches the browser.
import { getConnectorConfig } from "@/server/connector-config";
import {
  buildUrl,
  createSanitizedProxyRequest,
  proxyDelete,
  proxyHead,
  proxyPut,
  proxyPost,
  stripDataDestination,
} from "@/server/proxy";
import { NextRequest, NextResponse } from "next/server";

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
