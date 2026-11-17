import { getConnectorConfig } from "@/server/connector-config";
import { NextResponse } from "next/server";

async function handler(): Promise<NextResponse> {
  // To avoid leaking future config values
  const {
    id,
    name,
    description,
    publicUrl,
    managementUrl,
    defaultUrl,
    protocolUrl,
    curatorName,
    curatorUrl,
    maintainerName,
    maintainerUrl,
    dapsUrl,
    dapsJwksUrl,
    identityMode,
  } = getConnectorConfig();

  const response = NextResponse.json({
    id,
    name,
    description,
    publicUrl,
    managementUrl,
    defaultUrl,
    protocolUrl,
    curatorName,
    curatorUrl,
    maintainerName,
    maintainerUrl,
    dapsUrl,
    dapsJwksUrl,
    identityMode,
  });
  response.headers.set("Allow", "GET");
  return response;
}

export const GET = handler;
