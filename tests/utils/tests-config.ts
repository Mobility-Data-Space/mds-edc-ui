import { PROTOCOL_PATH } from "../../src/constants/catalog.ts";

// Compose stack started/stopped for local runs; e.g. ./docker-compose.dcp.yml for DCP.
export const COMPOSE_FILE =
  process.env.E2E_COMPOSE_FILE ?? "./docker-compose.e2e.yml";

export const SERVICES = ["edc-1", "edc-2"];

// Both stacks use DID participant ids, so the UI is told the stack's identity mode explicitly
// (CI passes the matrix stack name).
export const IDENTITY_MODE: "dcp" | "daps" =
  (process.env.E2E_IDENTITY_MODE ?? (COMPOSE_FILE.includes("dcp") ? "dcp" : "daps")) === "dcp"
    ? "dcp"
    : "daps";

const participantProtocolUrl =
  "http://" + SERVICES[0] + ":8183/api/dsp" + PROTOCOL_PATH;
const couterPartyparticipantProtocolUrl =
  "http://" + SERVICES[1] + ":8183/api/dsp" + PROTOCOL_PATH;

export const participantConfig = {
  APP_URL: "http://127.0.0.1:3000",
  EDC_ID: "did:web:wallet-1%3A7083:edc-1",
  EDC_NAME: "Think-it Test Connector 1",
  EDC_DESCRIPTION: "Think-it GmbH MDS EDC Test Connector 1",
  EDC_MANAGEMENT_URL: "http://localhost:8182/api/management",
  EDC_DEFAULT_URL: "http://localhost:8181/api",
  EDC_PROTOCOL_URL: participantProtocolUrl,
  EDC_PUBLIC_URL: "http://localhost:8185/public",
  EDC_MANAGEMENT_API_KEY: process.env.TEST_API_KEY || "default-test-api-key",
  EDC_CURATOR_ORGANIZATION: "Think-it GmbH",
  EDC_CURATOR_URL: "https://think-it.io",
  EDC_MAINTAINER_ORGANIZATION: "Think-it GmbH",
  EDC_MAINTAINER_URL: "https://think-it.io",
  MDS_DAPS_URL: "https://daps.mobility-dataspace.eu",
  MDS_DAPS_JWKS_URL: "https://daps.mobility-dataspace.eu/.well-known/jwks.json",
  EDC_IDENTITY_MODE: IDENTITY_MODE,
};

export const counterPartyParticipantConfig = {
  EDC_ID: "did:web:wallet-2%3A7083:edc-2",
  EDC_NAME: "Think-it Test Connector 2",
  EDC_DESCRIPTION: "Think-it GmbH MDS EDC Test Connector 2",
  EDC_MANAGEMENT_URL: "http://localhost:9182/api/management",
  EDC_DEFAULT_URL: "http://localhost:9181/api",
  EDC_PROTOCOL_URL: couterPartyparticipantProtocolUrl,
  EDC_PUBLIC_URL: "http://localhost:9185/public",
  EDC_MANAGEMENT_API_KEY: process.env.TEST_API_KEY || "default-test-api-key",
  EDC_CURATOR_ORGANIZATION: "Think-it GmbH",
  EDC_CURATOR_URL: "https://think-it.io",
  EDC_MAINTAINER_ORGANIZATION: "Think-it GmbH",
  EDC_MAINTAINER_URL: "https://think-it.io",
  MDS_DAPS_URL: "https://daps.mobility-dataspace.eu",
  MDS_DAPS_JWKS_URL: "https://daps.mobility-dataspace.eu/.well-known/jwks.json",
  EDC_IDENTITY_MODE: IDENTITY_MODE,
};
