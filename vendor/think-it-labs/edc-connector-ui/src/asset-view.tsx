import { Asset } from "@think-it-labs/edc-connector-client";
import React from "react";
import { PropsWithChildren, useCallback } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { JsonLdValue, ValueProps } from "./json-ld";
import { useViewContext, View } from "./view";

export const useAssetContext = () => useViewContext<Asset>();

interface AssetsProps {
  id: string;
  managementUrl: string;
}

export function AssetView(
  { children, id, managementUrl }: PropsWithChildren<AssetsProps>,
) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const get = useCallback(
    () => {
      if (id != undefined)
        return client.management.assets.get(id)
      
      return Promise.resolve(new Asset())
    },
    [client, id],
  );

  const del = useCallback(
    () => client.management.assets.delete(id),
    [client, id],
  );

  return (
    <View<Asset>
      get={get}
      delete={del}
      managementUrl={managementUrl}
    >
      {children}
    </View>
  );
}

AssetView.Id = function AssetId() {
  const { item } = useAssetContext();
  return <>{item?.id}</>;
};

AssetView.Loading = View.Loading;

AssetView.Properties = {
  Name: function AssetViewPropertiesName() {
    return (
      <AssetView.Properties.MandatoryValue
        prefix="edc"
        name="name"
      />
    );
  },
  ContentType: function AssetViewPropertiesContentType() {
    return (
      <AssetView.Properties.MandatoryValue
        prefix="edc"
        name="contenttype"
      />
    );
  },
  MandatoryValue: function AssetViewPropertiesMandatoryValue(
    props: Omit<ValueProps, "object" | "optional">,
  ) {
    const { item } = useAssetContext();
    return (
      <JsonLdValue
        object={item?.properties}
        {...props}
      />
    );
  },
  OptionalValue: function AssetViewPropertiesMandatoryValue(
    props: Omit<ValueProps, "object" | "optional">,
  ) {
    const { item } = useAssetContext();
    return (
      <JsonLdValue
        object={item?.properties}
        optional
        {...props}
      />
    );
  },
};

AssetView.Name = AssetView.Properties.Name;
AssetView.ContentType = AssetView.Properties.ContentType;

AssetView.PrivateProperties = {
  MandatoryValue: function AssetViewPropertiesMandatoryValue(
    props: Omit<ValueProps, "object" | "optional">,
  ) {
    const { item } = useAssetContext();
    return (
      <JsonLdValue
        object={item?.privateProperties}
        {...props}
      />
    );
  },
  OptionalValue: function AssetViewPropertiesMandatoryValue(
    props: Omit<ValueProps, "object" | "optional">,
  ) {
    const { item } = useAssetContext();
    return (
      <JsonLdValue
        object={item?.privateProperties}
        optional
        {...props}
      />
    );
  },
};

AssetView.DataAddress = {
  Name: function AssetViewDataAddressName() {
    return (
      <AssetView.DataAddress.MandatoryValue
        prefix="edc"
        name="name"
      />
    );
  },
  Type: function AssetViewDataAddressType() {
    return (
      <AssetView.DataAddress.MandatoryValue
        prefix="edc"
        name="type"
      />
    );
  },
  MandatoryValue: function AssetViewDataAddressMandatoryValue(
    props: Omit<ValueProps, "object" | "optional">,
  ) {
    const { item } = useAssetContext();
    return (
      <JsonLdValue
        object={item?.dataAddress}
        {...props}
      />
    );
  },
  OptionalValue: function AssetViewPropertiesMandatoryValue(
    props: Omit<ValueProps, "object" | "optional">,
  ) {
    const { item } = useAssetContext();
    return (
      <JsonLdValue
        object={item?.dataAddress}
        optional
        {...props}
      />
    );
  },
};
