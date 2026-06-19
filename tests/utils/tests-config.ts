import { PROTOCOL_PATH } from "../../src/constants/catalog.ts";

export const SERVICES = ["edc-1", "edc-2", "edc-3"];

export const DEAD_PROVIDER_ASSET_ID = "dead-provider-asset-1";

const participantProtocolUrl =
  "http://" + SERVICES[0] + ":8183/api/dsp" + PROTOCOL_PATH;
const couterPartyparticipantProtocolUrl =
  "http://" + SERVICES[1] + ":8183/api/dsp" + PROTOCOL_PATH;
const deadProviderProtocolUrl =
  "http://" + SERVICES[2] + ":8183/api/dsp" + PROTOCOL_PATH;

export const participantConfig = {
  APP_URL: "http://127.0.0.1:3000",
  EDC_ID: "MDSXXXXXXX.YYYYYYY",
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
};

export const counterPartyParticipantConfig = {
  EDC_ID: "MDSXXXXXXX.ZZZZZZZ",
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
};

// edc-3 is brought up just for seeding and stopped at the end of globalSetup,
// giving us a permanently-unreachable counterparty for resilience specs.
export const deadProviderConfig = {
  EDC_ID: "MDSXXXXXXX.WWWWWWW",
  EDC_NAME: "Think-it Dead Provider",
  EDC_DESCRIPTION: "Stopped after seed; used to test unreachable-provider flows",
  EDC_MANAGEMENT_URL: "http://localhost:10182/api/management",
  EDC_DEFAULT_URL: "http://localhost:10181/api",
  EDC_PROTOCOL_URL: deadProviderProtocolUrl,
  EDC_PUBLIC_URL: "http://localhost:10185/public",
  EDC_MANAGEMENT_API_KEY: process.env.TEST_API_KEY || "default-test-api-key",
  EDC_CURATOR_ORGANIZATION: "Think-it GmbH",
  EDC_CURATOR_URL: "https://think-it.io",
  EDC_MAINTAINER_ORGANIZATION: "Think-it GmbH",
  EDC_MAINTAINER_URL: "https://think-it.io",
  MDS_DAPS_URL: "https://daps.mobility-dataspace.eu",
  MDS_DAPS_JWKS_URL: "https://daps.mobility-dataspace.eu/.well-known/jwks.json",
};
