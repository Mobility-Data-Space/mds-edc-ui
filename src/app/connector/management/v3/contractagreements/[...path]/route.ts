import { queryEnrichedContractAgreements } from "@/utilities/contract-agreement-enrichment";
import {
  proxyDelete,
  proxyGet,
  proxyHead,
  proxyPost,
  proxyPut,
} from "@/utilities/proxy";
import { QuerySpec } from "@think-it-labs/edc-connector-client";
import { NextRequest, NextResponse } from "next/server";

const handlePost = async (req: NextRequest): Promise<NextResponse> => {
  const { pathname } = req.nextUrl;
  const pathParam = pathname.split("/contractagreements")[1] || "";

  if (pathParam.startsWith("/retirements")) {
    return proxyPost(req);
  }

  try {
    const body = (await req.json()) as QuerySpec;

    if (!body || typeof body !== "object") {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    const result = await queryEnrichedContractAgreements(body);
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not supported")) {
      return new NextResponse(error.message, { status: 501 });
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
