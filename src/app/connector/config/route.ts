import { Participant } from "@/utilities/participant";
import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

function participantConfig(): Participant {
  return {
    id: process.env.EDC_ID || "",
    name: process.env.EDC_NAME || "",
    description: process.env.EDC_DESCRIPTION || "",
    publicUrl: process.env.EDC_PUBLIC_URL || "",
    managementUrl: process.env.EDC_MANAGEMENT_URL || "",
    defaultUrl: process.env.EDC_DEFAULT_URL || "",
    protocolUrl: process.env.EDC_PROTOCOL_URL || "",
    curatorName: process.env.EDC_CURATOR_ORGANIZATION || "",
    curatorUrl: process.env.EDC_CURATOR_URL || "",
    maintainerName: process.env.EDC_MAINTAINER_ORGANIZATION || "",
    maintainerUrl: process.env.EDC_MAINTAINER_URL || "",
    dapsUrl: process.env.MDS_DAPS_URL || "",
    dapsJwksUrl: process.env.MDS_DAPS_JWKS_URL || ""
  };
}

async function handler(req: NextRequest): Promise<NextResponse> {
  // Check authentication first
  const authError = await requireAuth(req);
  if (authError) return authError;

  const response = NextResponse.json(participantConfig());
  response.headers.set("Allow", "GET");
  return response;
}

export const GET = handler;
