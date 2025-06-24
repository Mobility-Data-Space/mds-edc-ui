import { connectorApiKey, managementPrefix, participantConfig } from "@/utilities/env";
import { NextRequest, NextResponse } from "next/server";

export async function handler(req: NextRequest): Promise<NextResponse> {
  const { connectorManagementUrl } = participantConfig();
  const url = connectorManagementUrl + req.nextUrl.pathname.replace(managementPrefix, "") ;
  
  if (req.method?.toLowerCase() === "head") {
    return NextResponse.json(null, { status: 200 });
  }

  const requestBody = await req.json()
  const proxy = await fetch(url, {
    method: req.method,
    headers: {
      "content-type": "application/json",
      "x-api-key": connectorApiKey(),
    },
    credentials: "same-origin",
    body: !["get"].includes(req.method?.toLowerCase() || "") && requestBody
      ? JSON.stringify(requestBody)
      : undefined,
  });

  const contentType = proxy.headers.get("content-type");
  const response = new NextResponse(null, { status: proxy.status });

  if (contentType) {
    response.headers.set("content-type", contentType);
  }

  if (req.method?.toLowerCase() === "delete") {
    return response;
  }

  const readableStream = proxy.body;
  return new NextResponse(readableStream, { status: proxy.status });
}

export const GET: (req: NextRequest) => Promise<NextResponse> = handler;
export const POST: (req: NextRequest) => Promise<NextResponse> = handler;
export const PUT: (req: NextRequest) => Promise<NextResponse> = handler;
export const DELETE: (req: NextRequest) => Promise<NextResponse> = handler;
export const HEAD: (req: NextRequest) => Promise<NextResponse> = handler;
