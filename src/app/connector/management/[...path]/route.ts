import { connectorApiKey, managementPrefix, participantConfig } from "@/utilities/env";
import { NextRequest, NextResponse } from "next/server";

const buildUrl = (req: NextRequest): string => {
  const { connectorManagementUrl } = participantConfig();
  return connectorManagementUrl + req.nextUrl.pathname.replace(managementPrefix, "");
};

const fetchProxy = async (url: string, options: RequestInit): Promise<Response> => {
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

// Handler for POST requests
const handlePost = async (req: NextRequest): Promise<NextResponse> => {
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
