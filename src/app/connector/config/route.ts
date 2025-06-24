import { NextRequest, NextResponse } from "next/server";
import { participantConfig } from "@/utilities/env";

export async function handler(): Promise<NextResponse> {
  const response = NextResponse.json(participantConfig());
  response.headers.set("Allow", "GET");
  return response;
}

export const GET = handler;
