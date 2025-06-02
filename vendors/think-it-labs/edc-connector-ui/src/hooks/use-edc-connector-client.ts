import {
  Addresses,
  EdcConnectorClient,
} from "@think-it-labs/edc-connector-client";
import { useMemo } from "react";

export function useEdcConnectorClient(
  addresses: Addresses,
): EdcConnectorClient {
  return useMemo(
    () => {
      const builder = new EdcConnectorClient.Builder();

      if (addresses.management) {
        builder.managementUrl(addresses.management);
      }
      if (addresses.default) {
        builder.defaultUrl(addresses.default);
      }
      if (addresses.control) {
        builder.controlUrl(addresses.control);
      }
      if (addresses.protocol) {
        builder.protocolUrl(addresses.protocol);
      }
      if (addresses.public) {
        builder.publicUrl(addresses.public);
      }

      return builder.build();
    },
    [
      addresses.management,
      addresses.default,
      addresses.control,
      addresses.protocol,
      addresses.public,
    ],
  );
}
