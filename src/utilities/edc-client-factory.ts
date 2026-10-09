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
 * v4 rollout (issue #666): the migration is per-endpoint, so the second argument
 * selects the **management API version** for a given call site. The app never
 * sets a DSP protocol version in the browser, so repurposing this slot does not
 * collide with that meaning. It defaults to `"v3"`, which keeps every
 * not-yet-migrated call site on v3; an endpoint wave opts a call site into v4 by
 * passing `"v4"` to `useEdcConnectorClient(addresses, "v4")`.
 */
export function edcConnectorClientFactory(
  addresses: Addresses,
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
