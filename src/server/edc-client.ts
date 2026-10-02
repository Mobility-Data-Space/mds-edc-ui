import "server-only";

import { getConnectorConfig } from "@/server/connector-config";
import { EdcConnectorClient } from "@think-it-labs/edc-connector-client";
import { AgreementsRetirementController } from "@/utilities/contract-agreement";

export function getEdcClient() {
  const config = getConnectorConfig();
  return new EdcConnectorClient.Builder()
    .apiToken(config.apiKey)
    .managementUrl(config.managementUrl)
    .use("retirement", AgreementsRetirementController)
    .build();
}
