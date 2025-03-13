import { Asset, QuerySpec } from "@think-it-labs/edc-connector-client";
import React, { PropsWithChildren, useCallback } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { List, useListContext } from "./list";
import { Local, useLocalContext } from "./local";
import { JsonLdValue, ValueProps } from "./json-ld";

interface AssetsListProps {
  managementUrl: string;
}

export function AssetsList({
  children,
  managementUrl,
}: PropsWithChildren<AssetsListProps>) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const queryAll = useCallback(
    (querySpec: QuerySpec) => client.management.assets.queryAll(querySpec),
    [client],
  );

  const del = useCallback(
    (id: string) => client.management.assets.delete(id),
    [client],
  );

  return (
    <List<Asset>
      queryAll={queryAll}
      delete={del}
      getId={(asset: Asset) => asset.id}
      managementUrl={managementUrl}
    >
      {children}
    </List>
  );
}

AssetsList.Items = List.Items<Asset>;

AssetsList.Loading = List.Loading;

AssetsList.Search = List.Search;

AssetsList.SearchTrigger = List.SearchTrigger;

interface AssetsListAssetProps {
  asset?: Asset;
}

function AssetsListAsset(
  { asset, children }: PropsWithChildren<AssetsListAssetProps>,
) {
  const { managementUrl } = useListContext();
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  return (
    <Local
      item={asset}
      delete={async () => {
        if (asset?.id) {
          await client.management.assets.delete(asset?.id);
        }
      }}
    >
      {children}
    </Local>
  );
}

AssetsList.Asset = AssetsListAsset;

AssetsListAsset.Id = function AssetsListAssetId() {
  const { item } = useLocalContext<Asset>();
  return <>{item?.id}</>;
};

AssetsListAsset.Properties = {
  Name: function AssetsListAssetPropertiesName() {
    return (
      <AssetsListAsset.Properties.MandatoryValue
        prefix="edc"
        name="name"
      />
    );
  },
  ContentType: function AssetsListAssetPropertiesContentType() {
    return (
      <AssetsListAsset.Properties.MandatoryValue
        prefix="edc"
        name="contenttype"
      />
    );
  },
  MandatoryValue: function AssetsListAssetPropertiesMandatoryValue(
    props: Omit<ValueProps, "object" | "optional">,
  ) {
    const { item } = useLocalContext<Asset>();
    return (
      <JsonLdValue
        object={item?.properties}
        {...props}
      />
    );
  },
  OptionalValue: function AssetsListAssetPropertiesMandatoryValue(
    props: Omit<ValueProps, "object" | "optional">,
  ) {
    const { item } = useLocalContext<Asset>();
    return (
      <JsonLdValue
        object={item?.properties}
        optional
        {...props}
      />
    );
  },
};

AssetsListAsset.Name = AssetsListAsset.Properties.Name;
AssetsListAsset.ContentType = AssetsListAsset.Properties.ContentType;

AssetsListAsset.PrivateProperties = {
  MandatoryValue: function AssetsListAssetPropertiesMandatoryValue(
    props: Omit<ValueProps, "object" | "optional">,
  ) {
    const { item } = useLocalContext<Asset>();
    return (
      <JsonLdValue
        object={item?.privateProperties}
        {...props}
      />
    );
  },
  OptionalValue: function AssetsListAssetPropertiesMandatoryValue(
    props: Omit<ValueProps, "object" | "optional">,
  ) {
    const { item } = useLocalContext<Asset>();
    return (
      <JsonLdValue
        object={item?.privateProperties}
        optional
        {...props}
      />
    );
  },
};

AssetsListAsset.DataAddress = {
  Name: function AssetsListAssetDataAddressName() {
    return (
      <AssetsListAsset.DataAddress.MandatoryValue
        prefix="edc"
        name="name"
      />
    );
  },
  Type: function AssetsListAssetDataAddressType() {
    return (
      <AssetsListAsset.DataAddress.MandatoryValue
        prefix="edc"
        name="type"
      />
    );
  },
  MandatoryValue: function AssetsListAssetDataAddressMandatoryValue(
    props: Omit<ValueProps, "object" | "optional">,
  ) {
    const { item } = useLocalContext<Asset>();
    return (
      <JsonLdValue
        object={item?.dataAddress}
        {...props}
      />
    );
  },
  OptionalValue: function AssetsListAssetPropertiesMandatoryValue(
    props: Omit<ValueProps, "object" | "optional">,
  ) {
    const { item } = useLocalContext<Asset>();
    return (
      <JsonLdValue
        object={item?.dataAddress}
        optional
        {...props}
      />
    );
  },
};
