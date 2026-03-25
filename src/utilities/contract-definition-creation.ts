import { getConnectorConfig } from "@/utilities/connector-config";
import { getEdcClient } from "@/utilities/edc-client";
import { createProxyRequest, setResponseHeaders } from "@/utilities/proxy";
import { NextResponse } from "next/server";

const MAX_RETRIES = 5;

export interface ContractDefinitionBody {
  "@id"?: string;
  accessPolicyId: string;
  contractPolicyId: string;
  assetsSelector: unknown[];
  privateProperties?: Record<string, unknown>;
}

function generateDatePrefix(): string {
  const prefix = "mds-data-offer-";
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${prefix}${day}${month}${year}`;
}

async function getNextSequenceNumber(datePrefix: string): Promise<number> {
  const client = getEdcClient();
  const existingTodayContracts =
    await client.management.contractDefinitions.queryAll({
      offset: 0,
      limit: 1000,
      filterExpression: [
        {
          operandLeft: "id",
          operator: "like",
          operandRight: `${datePrefix}_%`,
        },
      ],
      sortField: "createdAt",
      sortOrder: "DESC",
    });

  const existingIds = existingTodayContracts.map((contract) => contract["@id"]);

  const maxUid = existingIds
    .filter((id) => id.startsWith(`${datePrefix}_`))
    .map((id) => {
      const uidPart = id.substring(`${datePrefix}_`.length);
      return parseInt(uidPart, 10);
    })
    .filter((uid) => !isNaN(uid))
    .reduce((max, uid) => Math.max(max, uid), 0);

  return maxUid + 1;
}

export async function createContractDefinitionWithRetry(
  body: ContractDefinitionBody,
): Promise<NextResponse> {
  const config = getConnectorConfig();
  const datePrefix = generateDatePrefix();

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const sequenceNumber = await getNextSequenceNumber(datePrefix);
    const contractId = `${datePrefix}_${sequenceNumber}`;

    const contractDefinition = {
      ...body,
      "@id": contractId,
    };

    const url = `${config.managementUrl}/v3/contractdefinitions`;
    const proxy = await createProxyRequest(
      url,
      "POST",
      config.apiKey,
      JSON.stringify(contractDefinition),
      {
        "content-type": "application/json",
      },
    );

    if (proxy.status === 409) {
      console.log(
        `Contract ID ${contractId} already exists, retrying (attempt ${attempt + 1}/${MAX_RETRIES})`,
      );
      continue;
    }

    const readableStream = proxy.body;
    const response = new NextResponse(readableStream, { status: proxy.status });
    setResponseHeaders(proxy, response);
    return response;
  }

  return NextResponse.json(
    {
      message: `Failed to create contract definition after ${MAX_RETRIES} attempts due to ID conflicts`,
      type: "RetryExhausted",
    },
    { status: 500 },
  );
}
