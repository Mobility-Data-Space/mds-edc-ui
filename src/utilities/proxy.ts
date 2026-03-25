import "server-only";

import { proxyConnectorManagement } from "@/constants/proxy";
import { getConnectorConfig } from "@/utilities/connector-config";
import { NextRequest, NextResponse } from "next/server";

export const buildUrl = (req: NextRequest): string => {
  const config = getConnectorConfig();
  return (
    config.managementUrl +
    req.nextUrl.pathname.replace(proxyConnectorManagement, "")
  );
};

export const fetchProxy = async (
  url: string,
  options: RequestInit,
): Promise<Response> => {
  return await fetch(url, options);
};

export const setResponseHeaders = (
  proxy: Response,
  response: NextResponse,
): void => {
  const contentType = proxy.headers.get("content-type");
  if (contentType) {
    response.headers.set("content-type", contentType);
  }
};

export const createProxyRequest = async (
  url: string,
  method: string,
  apiKey: string,
  body?: string,
  headers?: Record<string, string>,
): Promise<NextResponse> => {
  const proxy = await fetchProxy(url, {
    method,
    headers: {
      ...headers,
      ...(body && { "content-type": "application/json" }),
      "x-api-key": apiKey,
    },
    credentials: "same-origin",
    body: body && body !== "{}" ? body : undefined,
  });

  const readableStream = proxy.body;
  const response = new NextResponse(readableStream, { status: proxy.status });
  setResponseHeaders(proxy, response);

  return response;
};

export const proxyGet = async (req: NextRequest): Promise<NextResponse> => {
  const url = buildUrl(req);
  const config = getConnectorConfig();
  return createProxyRequest(url, "GET", config.apiKey);
};

export const proxyPost = async (req: NextRequest): Promise<NextResponse> => {
  const url = buildUrl(req);
  const requestBody = await req.text();
  const config = getConnectorConfig();
  return createProxyRequest(url, "POST", config.apiKey, requestBody);
};

export const proxyPut = async (req: NextRequest): Promise<NextResponse> => {
  const url = buildUrl(req);
  const requestBody = await req.text();
  const config = getConnectorConfig();
  return createProxyRequest(url, "PUT", config.apiKey, requestBody);
};

export const proxyDelete = async (req: NextRequest): Promise<NextResponse> => {
  const url = buildUrl(req);
  const config = getConnectorConfig();
  const proxy = await createProxyRequest(url, "DELETE", config.apiKey);
  return new NextResponse(null, { status: proxy.status });
};

export const proxyHead = async (): Promise<NextResponse> => {
  return NextResponse.json(null, { status: 200 });
};
