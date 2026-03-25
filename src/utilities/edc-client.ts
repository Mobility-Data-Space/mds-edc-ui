import "server-only";

import { getConnectorConfig } from "@/utilities/connector-config";
import { EdcConnectorClient } from "@think-it-labs/edc-connector-client";
import { AgreementsRetirementController } from "./contract-agreement";

export function getEdcClient() {
  const config = getConnectorConfig();
  return new EdcConnectorClient.Builder()
    .apiToken(config.apiKey)
    .managementUrl(config.managementUrl)
    .use("retirement", AgreementsRetirementController)
    .build();
}
