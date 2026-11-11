import "server-only";

import { getConnectorConfig } from "@/server/connector-config";
import { withMdsManagementConfig } from "@/jsonld/mds-management-config";
import { EdcConnectorClient } from "@think-it-labs/edc-connector-client";
import { AgreementsRetirementController } from "@/utilities/contract-agreement";

/**
 * Server client targeting the EDC management API **v4**, configured with the
 * MDS JSON-LD context and the cached contexts (see {@link withMdsManagementConfig}).
 */
export function getEdcClient() {
  const config = getConnectorConfig();
  return withMdsManagementConfig(
    new EdcConnectorClient.Builder()
      .apiToken(config.apiKey)
      .managementUrl(config.managementUrl)
      .use("retirement", AgreementsRetirementController),
  ).build();
}
