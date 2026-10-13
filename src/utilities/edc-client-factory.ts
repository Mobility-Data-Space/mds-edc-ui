import {
  withCachedJsonLdContexts,
  withMdsManagementConfig,
} from "@/jsonld/mds-management-config";
import {
  Addresses,
  EdcConnectorClient,
} from "@think-it-labs/edc-connector-client";

/**
 * Browser-side factory wired into {@link EdcConnectorClientProvider} so every
 * `useEdcConnectorClient()` call builds its client through here instead of the
 * library's built-in default (which hardcodes v4).
 *
 * v4 rollout (issue #666): the migration is per-endpoint. The library forwards
 * the call site's `managementApiVersion` (edc-connector-ui >= 0.3.4) here as the
 * third argument, so a call site opts into v4 with
 * `useEdcConnectorClient(addresses, undefined, "v4")` (or the `managementApiVersion`
 * prop on the list/form components). It defaults to `"v3"` — keeping every
 * not-yet-migrated call site on v3 — when the call site passes nothing.
 *
 * The second argument is the DSP `protocolVersion`, which the app never sets in
 * the browser; it is an unused positional placeholder so `managementApiVersion`
 * lands as the third argument the library passes.
 */
export function edcConnectorClientFactory(
  addresses: Addresses,
  _protocolVersion: string | undefined,
  managementApiVersion: string = "v3",
): EdcConnectorClient {
  const builder = new EdcConnectorClient.Builder();

  if (addresses.management) {
    builder.managementUrl(addresses.management);
  }
  if (addresses.default) {
    builder.defaultUrl(addresses.default);
  }

  if (managementApiVersion === "v4") {
    withMdsManagementConfig(builder);
  } else {
    withCachedJsonLdContexts(builder).managementApiVersion("v3");
  }

  return builder.build();
}
