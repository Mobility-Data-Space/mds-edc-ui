import { type Participant } from "../../src/utilities/participant.ts";
import {
  type TransferProcessInput,
  EdcConnectorClient,
  IdResponse,
  PolicyBuilder,
} from "@think-it-labs/edc-connector-client";
import { randomUUID } from "node:crypto";
import { DEAD_PROVIDER_ASSET_ID } from "./tests-config.ts";

async function waitForNegotiationState(
  client: EdcConnectorClient,
  negotiationId: string,
  targetState: string,
  interval = 500,
  times = 50,
): Promise<void> {
  let waiting = true;
  let actualState: string;

  do {
    times--;
    await new Promise((resolve) => setTimeout(resolve, interval));

    const response =
      await client.management.contractNegotiations.getState(negotiationId);
    actualState = response.state;

    waiting = actualState !== targetState;
  } while (waiting && times > 0);

  if (actualState !== targetState) {
    throw new Error("state mismatch");
  }
}

export async function publish_offers(participant: Participant) {
  const client: EdcConnectorClient = new EdcConnectorClient.Builder()
    .managementUrl(participant.managementUrl)
    .apiToken(process.env.TEST_API_KEY || "default-test-api-key")
    .build();

  // Create assets
  const assetCount = 10;
  const assetPromises: Promise<IdResponse>[] = [];

  console.log("Create assets for", participant.id);
  for (let i = 0; i < assetCount; i++) {
    assetPromises.push(
      client.management.assets.create({
        "@id": `asset-${i + 1}-id`,
        properties: {
          "http://purl.org/dc/terms/title": `${participant.name} - Asset ${i + 1}`,
          "https://w3id.org/mobilitydcat-ap/mobilityTheme": {
            "https://w3id.org/mobilitydcat-ap/mobility-theme/data-content-category":
              "PUBLIC_TRANSPORT_SCHEDULED_TRANSPORT",
            "https://w3id.org/mobilitydcat-ap/mobility-theme/data-content-sub-category":
              "OPERATIONAL_CALENDAR",
          },
          "https://w3id.org/mobilitydcat-ap/mobilityDataStandard": {
            "@id": "my-data-model-001",
            "https://w3id.org/mobilitydcat-ap/schema": {
              "http://www.w3.org/ns/dcat#downloadURL": [
                "https://teamabc.departmentxyz.schema/a",
                "https://teamabc.departmentxyz.schema/b",
              ],
              "http://www.w3.org/2000/01/rdf-schema#Literal":
                "These reference files are important",
            },
          },
          "https://w3id.org/mobilitydcat-ap/transportMode":
            "LONG_DISTANCE_COACH",
          "https://w3id.org/mobilitydcat-ap/georeferencingMethod":
            "my-geo-reference-method",
          "http://purl.org/dc/terms/description": `Description for Asset ${i + 1}`,
          "http://purl.org/dc/terms/language": "code/EN",
          "http://purl.org/dc/terms/publisher":
            "https://data-source.my-org/about",
          "http://purl.org/dc/terms/license":
            "https://data-source.my-org/license",
          "http://purl.org/dc/terms/rightsHolder": "Think-it GmbH",
          "http://purl.org/dc/terms/accessRights": "usage policies and rights",
          "http://purl.org/dc/terms/spatial": {
            "http://www.w3.org/2004/02/skos/core#prefLabel": "my-geo-location",
            "http://purl.org/dc/terms/identifier": ["DE769", "DE636"],
          },
          "http://purl.org/dc/terms/isReferencedBy":
            "https://data-source.my-org/references",
          "http://purl.org/dc/terms/temporal": {
            "http://www.w3.org/ns/dcat#startDate": "2024-02-01",
            "http://www.w3.org/ns/dcat#endDate": "2027-02-01",
          },
          "http://purl.org/dc/terms/accrualPeriodicity": "every month",
          "http://www.w3.org/ns/dcat#organization": "Think-it GmbH",
          "http://www.w3.org/ns/dcat#keywords": ["keyword1", "keyword2"],
          "http://www.w3.org/ns/dcat#mediaType": "application/json",
          "http://www.w3.org/ns/dcat#landingPage":
            "https://data-source.my-org/docs",
          "http://www.w3.org/2002/07/owl#versionInfo": "1.1",
          "http://www.w3.org/ns/adms#sample": [
            "https://teamabc.departmentxyz.sample/a",
            "https://teamabc.departmentxyz.sample/b",
          ],
        },
        dataAddress: {
          type: "HttpData",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
        },
        privateProperties: {
          notes: "Some safe notes",
        },
      }),
    );
  }

  console.log("  awaiting creation assets for", participant.id);
  await Promise.all(assetPromises);
  console.log("  assets created", participant.id);

  console.log("Create contract definitions for", participant.id);
  const contractDefinitionPromises: Promise<IdResponse>[] = [];
  const policyDefinitionId = "always-true";
  contractDefinitionPromises.push(
    client.management.contractDefinitions.create({
      "@id": randomUUID(),
      accessPolicyId: policyDefinitionId,
      contractPolicyId: policyDefinitionId,
      assetsSelector: [
        {
          operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
          operator: "in",
          operandRight: [
            "asset-1-id",
            "asset-2-id",
            "asset-3-id",
            "asset-4-id",
            "asset-5-id",
            "asset-6-id",
            "asset-7-id",
          ],
        },
      ],
    }),
  );
  console.log("  awaiting creation contract definitions for", participant.id);
  await Promise.all(contractDefinitionPromises);
  console.log("  contract definitions created", participant.id);
}

export async function create_pending_negotiations(
  participant: Participant,
  counterPartyParticipant: Participant,
) {
  const participantClient: EdcConnectorClient = new EdcConnectorClient.Builder()
    .managementUrl(participant.managementUrl)
    .apiToken(process.env.TEST_API_KEY || "default-test-api-key")
    .build();

  const counterPartyClient: EdcConnectorClient =
    new EdcConnectorClient.Builder()
      .managementUrl(counterPartyParticipant.managementUrl)
      .apiToken(process.env.TEST_API_KEY || "default-test-api-key")
      .build();

  await participantClient.management.contractDefinitions.create({
    "@id": "manual-approval-contract-def",
    accessPolicyId: "always-true",
    contractPolicyId: "always-true",
    assetsSelector: [
      {
        operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
        operator: "in",
        operandRight: ["asset-8-id", "asset-9-id", "asset-10-id"],
      },
    ],
    privateProperties: {
      manualApproval: "true",
    },
  } as any);

  const catalog = await counterPartyClient.management.catalog.request({
    counterPartyId: participant.id,
    counterPartyAddress: participant.protocolUrl,
  });

  const targetAssets = catalog.datasets.filter(
    (d: any) =>
      d.id === "asset-8-id" ||
      d.id === "asset-9-id" ||
      d.id === "asset-10-id",
  );

  for (const dataset of targetAssets) {
    const offer = dataset.offers[0];

    const policy = new PolicyBuilder()
      .type("Offer")
      .raw({
        ...offer,
        assigner: participant.id,
        target: dataset.id,
      })
      .build();

    await counterPartyClient.management.contractNegotiations.initiate({
      counterPartyId: participant.id,
      counterPartyAddress: participant.protocolUrl,
      policy,
    });
  }

  // Poll for pending
  const expectedCount = targetAssets.length;
  let attempts = 0;
  const maxAttempts = 15;
  const pollInterval = 2000;

  while (attempts < maxAttempts) {
    attempts++;
    await new Promise((resolve) => setTimeout(resolve, pollInterval));

    const pendingNegotiations =
      await participantClient.management.contractNegotiations.queryAll({
        filterExpression: [
          { operandLeft: "pending", operator: "=", operandRight: true },
        ],
      });

    if (pendingNegotiations.length >= expectedCount) {
      break;
    }

    if (attempts === maxAttempts) {
      throw new Error(
        `Timed out waiting for ${expectedCount} pending negotiations (got ${pendingNegotiations.length})`,
      );
    }
  }
}

export async function initiate_transfers(
  participant: Participant,
  counterPartyParticipant: Participant,
) {
  const client: EdcConnectorClient = new EdcConnectorClient.Builder()
    .managementUrl(participant.managementUrl)
    .apiToken(process.env.TEST_API_KEY || "default-test-api-key")
    .build();

  // Initiate negotiation and transfer process
  console.log(
    "Initiate negotiation and transfer process for",
    participant.id,
    counterPartyParticipant.protocolUrl,
  );

  const catalog = await client.management.catalog.request({
    counterPartyId: counterPartyParticipant.id,
    counterPartyAddress: counterPartyParticipant.protocolUrl,
  });

  const dataset = catalog.datasets[0];

  const offer = dataset.offers[0];
  const p = new PolicyBuilder()
    .type("Offer")
    .raw({
      ...offer,
      assigner: counterPartyParticipant.id,
      target: dataset.id,
    })
    .build();

  const negotiationResponse =
    await client.management.contractNegotiations.initiate({
      counterPartyId: counterPartyParticipant.id,
      counterPartyAddress: counterPartyParticipant.protocolUrl,
      policy: p,
    });

  console.log("  awaiting negotiation finalization for", participant.id);

  await waitForNegotiationState(client, negotiationResponse.id, "FINALIZED");

  const contractNegotiation = await client.management.contractNegotiations.get(
    negotiationResponse.id,
  );

  const contractAgreement = await client.management.contractAgreements.get(
    contractNegotiation.contractAgreementId,
  );

  const transferProcessInput = {
    counterPartyAddress: participant.protocolUrl,
    contractId: contractAgreement.id,
    transferType: "HttpData-PULL",
  } as TransferProcessInput;

  const transferResponse =
    await client.management.transferProcesses.initiate(transferProcessInput);

  console.log(
    "  transfer process initiated for",
    participant.id,
    "with transfer ID",
    transferResponse.id,
  );
}

export async function seed_dead_provider(
  consumer: Participant,
  dead: Participant,
) {
  const deadClient: EdcConnectorClient = new EdcConnectorClient.Builder()
    .managementUrl(dead.managementUrl)
    .apiToken(process.env.TEST_API_KEY || "default-test-api-key")
    .build();

  console.log("Create dead-provider asset on", dead.id);
  await deadClient.management.assets.create({
    "@id": DEAD_PROVIDER_ASSET_ID,
    properties: {
      "http://purl.org/dc/terms/title": "Dead Provider Asset",
      "http://purl.org/dc/terms/description":
        "Asset whose provider is stopped after seed",
      "https://w3id.org/mobilitydcat-ap/mobilityTheme": {
        "https://w3id.org/mobilitydcat-ap/mobility-theme/data-content-category":
          "PUBLIC_TRANSPORT_SCHEDULED_TRANSPORT",
        "https://w3id.org/mobilitydcat-ap/mobility-theme/data-content-sub-category":
          "OPERATIONAL_CALENDAR",
      },
      "https://w3id.org/mobilitydcat-ap/mobilityDataStandard": {
        "@id": "my-data-model-001",
      },
      "https://w3id.org/mobilitydcat-ap/transportMode": "LONG_DISTANCE_COACH",
      "https://w3id.org/mobilitydcat-ap/georeferencingMethod":
        "my-geo-reference-method",
      "http://purl.org/dc/terms/language": "code/EN",
      "http://purl.org/dc/terms/publisher":
        "https://data-source.my-org/about",
      "http://purl.org/dc/terms/license":
        "https://data-source.my-org/license",
      "http://purl.org/dc/terms/rightsHolder": "Think-it GmbH",
      "http://purl.org/dc/terms/accessRights": "usage policies and rights",
    },
    dataAddress: {
      type: "HttpData",
      baseUrl: "https://jsonplaceholder.typicode.com/users",
    },
  });

  await deadClient.management.contractDefinitions.create({
    "@id": "dead-provider-contract-def",
    accessPolicyId: "always-true",
    contractPolicyId: "always-true",
    assetsSelector: [
      {
        operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
        operator: "=",
        operandRight: DEAD_PROVIDER_ASSET_ID,
      },
    ],
  });

  const consumerClient: EdcConnectorClient = new EdcConnectorClient.Builder()
    .managementUrl(consumer.managementUrl)
    .apiToken(process.env.TEST_API_KEY || "default-test-api-key")
    .build();

  console.log("Negotiate dead-provider agreement from", consumer.id);
  const catalog = await consumerClient.management.catalog.request({
    counterPartyId: dead.id,
    counterPartyAddress: dead.protocolUrl,
  });

  const dataset = catalog.datasets.find(
    (d: any) => d.id === DEAD_PROVIDER_ASSET_ID,
  );
  if (!dataset) {
    throw new Error(
      `Dead-provider asset ${DEAD_PROVIDER_ASSET_ID} missing from catalog`,
    );
  }

  const offer = dataset.offers[0];
  const policy = new PolicyBuilder()
    .type("Offer")
    .raw({ ...offer, assigner: dead.id, target: dataset.id })
    .build();

  const negotiation =
    await consumerClient.management.contractNegotiations.initiate({
      counterPartyId: dead.id,
      counterPartyAddress: dead.protocolUrl,
      policy,
    });

  await waitForNegotiationState(consumerClient, negotiation.id, "FINALIZED");
  console.log("  dead-provider agreement finalized");
}
