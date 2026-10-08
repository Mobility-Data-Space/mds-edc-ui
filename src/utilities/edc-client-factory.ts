import { withMdsManagementConfig } from "@/jsonld/mds-management-config";
import {
  type Addresses,
  EdcConnectorClient,
} from "@think-it-labs/edc-connector-client";

// Factory handed to edc-connector-ui's `EdcConnectorClientProvider` so the
// library's components build their client the same way the server does (see
// src/server/edc-client.ts): the MDS management v4 config with the cached
// JSON-LD contexts the bundled `jsonld` cannot dereference in the browser. Keep
// this a stable module-level reference so the hook's memoized client is not
// rebuilt.
export const edcConnectorClientFactory = (
  addresses: Addresses,
  protocolVersion?: string,
): EdcConnectorClient => {
  const builder = new EdcConnectorClient.Builder();

  if (addresses.management) {
    builder.managementUrl(addresses.management);
  }
  if (addresses.default) {
    builder.defaultUrl(addresses.default);
  }
  if (protocolVersion) {
    builder.protocolVersion(protocolVersion);
  }

  return withMdsManagementConfig(builder).build();
};
