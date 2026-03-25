import { getConnectorConfig } from "@/utilities/connector-config";
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
  });
  response.headers.set("Allow", "GET");
  return response;
}

export const GET = handler;
