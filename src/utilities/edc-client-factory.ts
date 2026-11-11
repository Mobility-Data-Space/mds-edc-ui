import { withMdsManagementConfig } from "@/jsonld/mds-management-config";
import {
  Addresses,
  EdcConnectorClient,
} from "@think-it-labs/edc-connector-client";

/**
 * Browser-side factory wired into {@link EdcConnectorClientProvider} so every
 * `useEdcConnectorClient()` call builds its client through here instead of the
 * library's built-in default. It always targets the management API **v4** with
 * the MDS JSON-LD configuration (see {@link withMdsManagementConfig}).
 */
export function edcConnectorClientFactory(
  addresses: Addresses,
): EdcConnectorClient {
  const builder = new EdcConnectorClient.Builder();

  if (addresses.management) {
    builder.managementUrl(addresses.management);
  }
  if (addresses.default) {
    builder.defaultUrl(addresses.default);
  }

  return withMdsManagementConfig(builder).build();
}
