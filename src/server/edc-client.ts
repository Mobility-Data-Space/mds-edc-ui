import "server-only";

import { getConnectorConfig } from "@/server/connector-config";
import { EdcConnectorClient } from "@think-it-labs/edc-connector-client";
import { AgreementsRetirementController } from "@/utilities/contract-agreement";
import { withMdsManagementConfig } from "@/jsonld/mds-management-config";

export function getEdcClient() {
  const config = getConnectorConfig();
  return withMdsManagementConfig(
    new EdcConnectorClient.Builder()
      .apiToken(config.apiKey)
      .managementUrl(config.managementUrl)
      .use("retirement", AgreementsRetirementController),
  ).build();
}
