import { NextRequest, NextResponse } from "next/server";
import { participantConfig } from "@/utilities/env";

export async function handler(req: NextRequest): Promise<NextResponse> {
  if (req.method !== "GET") {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }

  const response = NextResponse.json(participantConfig());
  response.headers.set("Allow", "GET");
  return response;
}

export const GET = handler;
