import { getConnectorConfig } from "@/server/connector-config";
import { NextResponse } from "next/server";
import packageJson from "../../../package.json";

interface VersionInfo {
  mdsEdcUiVersion: string;
  mdsEdcVersion: string;
}

function getVersionInfo(): VersionInfo {
  return {
    mdsEdcUiVersion: process.env.APP_VERSION || packageJson.version,
    mdsEdcVersion:
      getConnectorConfig().edcVersion ||
      packageJson.config?.mdsEdcVersion ||
      "unknown",
  };
}

async function handler(): Promise<NextResponse> {
  const response = NextResponse.json(getVersionInfo());
  response.headers.set("Allow", "GET");
  return response;
}

export const GET = handler;