import {
  EdcConnectorClient,
  IdResponse,
} from "@think-it-labs/edc-connector-client";
import { randomUUID } from "node:crypto";

const SEED = parseInt(process.env.SEED || "25");

function randomNumber(max: number): number {
  return Math.max(Math.round(Math.random() * max), 1);
}

async function main() {
  const client: EdcConnectorClient = new EdcConnectorClient
    .Builder()
    .managementUrl("http://localhost:3003/management")
    .build();

  const assetCount = randomNumber(SEED);
  const assetPromises: Promise<IdResponse>[] = [];
  for (let i = 0; i < assetCount; i++) {
    assetPromises.push(
      client.management.assets.create({
        "@id": randomUUID(),
        properties: {
          name: `Asset ${i + 1}`,
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
        },
      }),
    );
  }

  await Promise.all(assetPromises);
}

main()
  .then(() => console.log("DONE"))
  .catch(console.error);
