import "server-only";

import { getConnectorConfig } from "@/utilities/connector-config";
import { EdcConnectorClient } from "@think-it-labs/edc-connector-client";
import { AgreementsRetirementController } from "./contract-agreement";
import mdsManagementV1Context from "@/jsonld/mds-management-v1.json";

// MDS management JSON-LD context. v4 responses carry this URL in their
// `@context`, but the client's bundled `jsonld` cannot dereference remote
// contexts in this Node runtime (its HTTP loader is incompatible with the
// pinned undici), so we hand the client a cached copy to expand offline.
const MDS_MANAGEMENT_V1_CONTEXT_URL =
  "https://w3id.org/mobility-dataspace/connector/management/v1";

export function getEdcClient() {
  const config = getConnectorConfig();
  return new EdcConnectorClient.Builder()
    .apiToken(config.apiKey)
    .managementUrl(config.managementUrl)
    .managementApiVersion("v4")
    .cachedJsonLdContext(MDS_MANAGEMENT_V1_CONTEXT_URL, mdsManagementV1Context)
    .use("retirement", AgreementsRetirementController)
    .build();
}
