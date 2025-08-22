import { NextRequest, NextResponse } from "next/server";
import packageJson from "../../../package.json";

interface VersionInfo {
  mdsEdcUiVersion: string;
  mdsEdcVersion: string;
}

function getVersionInfo(): VersionInfo {
  return {
    mdsEdcUiVersion: packageJson.version,
    mdsEdcVersion: packageJson.config?.mdsEdcVersion || "unknown"
  };
}

async function handler(req: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json(getVersionInfo());
  response.headers.set("Allow", "GET");
  return response;
}

export const GET = handler;