import { getConnectorConfig } from "@/server/connector-config";
import { DidDiscoveryError, discoverConnectors } from "@/server/did-discovery";
import { NextRequest, NextResponse } from "next/server";

// Resolved here rather than in the browser: DID documents and version metadata
// endpoints are not served with CORS headers for other origins.
async function handler(request: NextRequest): Promise<NextResponse> {
  // DID discovery is DCP-only; a DAPS connector has no use for this outbound fetch.
  if (getConnectorConfig().identityMode !== "dcp") {
    return NextResponse.json(
      { message: "DID discovery is only available on DCP connectors" },
      { status: 404 },
    );
  }

  const did = request.nextUrl.searchParams.get("did")?.trim() ?? "";
  if (!did) {
    return NextResponse.json({ message: "did query parameter is required" }, { status: 400 });
  }

  try {
    const connectors = await discoverConnectors(did);
    return NextResponse.json({ did, connectors });
  } catch (error) {
    if (error instanceof DidDiscoveryError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("DID discovery failed", error);
    return NextResponse.json({ message: "DID discovery failed" }, { status: 500 });
  }
}

export const GET = handler;
