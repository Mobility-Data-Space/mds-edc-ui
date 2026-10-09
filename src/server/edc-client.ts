import "server-only";

import { getConnectorConfig } from "@/server/connector-config";
import {
  withCachedJsonLdContexts,
  withMdsManagementConfig,
} from "@/jsonld/mds-management-config";
import { EdcConnectorClient } from "@think-it-labs/edc-connector-client";
import { AgreementsRetirementController } from "@/utilities/contract-agreement";

/**
 * Server client targeting the EDC management API **v3**. This is the default
 * used across the app; the v4 rollout (issue #666) moves endpoints onto
 * {@link getEdcClientV4} one wave at a time. The cached JSON-LD contexts are
 * required even on v3 (see {@link withCachedJsonLdContexts}).
 */
export function getEdcClientV3() {
  const config = getConnectorConfig();
  return withCachedJsonLdContexts(
    new EdcConnectorClient.Builder()
      .apiToken(config.apiKey)
      .managementUrl(config.managementUrl)
      .use("retirement", AgreementsRetirementController),
  ).build();
}

/**
 * Server client targeting the EDC management API **v4**, configured with the
 * MDS JSON-LD context (see {@link withMdsManagementConfig}). Not yet used by any
 * endpoint; endpoint waves repoint their server-side calls here.
 */
export function getEdcClientV4() {
  const config = getConnectorConfig();
  return withMdsManagementConfig(
    new EdcConnectorClient.Builder()
      .apiToken(config.apiKey)
      .managementUrl(config.managementUrl)
      .use("retirement", AgreementsRetirementController),
  ).build();
}

/** Active server client. Points at v3 until the rollout flips endpoints. */
export function getEdcClient() {
  return getEdcClientV3();
}
