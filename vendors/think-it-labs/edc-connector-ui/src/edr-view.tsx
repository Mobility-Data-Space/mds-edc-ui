import { Edr } from "@think-it-labs/edc-connector-client";
import React, { PropsWithChildren, useCallback } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { useViewContext, View } from "./view";
import { JsonLdValue, ValueProps } from "./json-ld";

export const useEdrContext = () => useViewContext<Edr>();

interface EdrProps {
  id: string;
  managementUrl: string;
}

export function EdrView({
  children,
  id,
  managementUrl,
}: PropsWithChildren<EdrProps>) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const get = useCallback(() => {
    if (id != undefined)
      return client.management.edrs.dataAddress(id) as Promise<Edr>; // should be fixed in upstream;

    return Promise.resolve(new Edr());
  }, [client, id]);

  return (
    <View<Edr> get={get} managementUrl={managementUrl} cacheKey={id}>
      {children}
    </View>
  );
}

EdrView.Item = function EdrViewItem() {
  const { item } = useEdrContext();
  return item;
};

EdrView.Properties = {
  Type: function EdrViewPropertiesType() {
    return <EdrView.Properties.MandatoryValue prefix="edc" name="type" />;
  },
  Endpoint: function AssetViewPropertiesEndpoint() {
    return <EdrView.Properties.MandatoryValue prefix="edc" name="endpoint" />;
  },
  AuthType: function EdrViewPropertiesAuthType() {
    return <EdrView.Properties.MandatoryValue prefix="edc" name="authType" />;
  },
  EndpointType: function EdrViewPropertiesEndpointType() {
    return (
      <EdrView.Properties.MandatoryValue prefix="edc" name="endpointType" />
    );
  },
  Authorization: function EdrViewPropertiesAuthorization() {
    return (
      <EdrView.Properties.MandatoryValue prefix="edc" name="authorization" />
    );
  },
  MandatoryValue: function AssetViewPropertiesMandatoryValue(
    props: Omit<ValueProps, "object" | "optional">,
  ) {
    const { item } = useEdrContext();

    if (!item) {
      return null;
    }

    return <JsonLdValue object={item} {...props} />;
  },
};

EdrView.Loading = View.Loading;

EdrView.Error = View.Error;
