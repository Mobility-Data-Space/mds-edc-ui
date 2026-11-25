import { Icon, IconProps } from "@mui/material";
import React from "react";

import { Asset } from "@think-it-labs/edc-connector-client";

import { DataAddressTypes } from "@/utilities/data-address";
import { assetDataplaneProperty } from "@/domain/asset/mapper";

export function AssetIcon({ asset, ...rest }: { asset: Asset } & IconProps): React.ReactElement {
  let icon;
  const type = assetDataplaneProperty(asset, "type");

  if (type === DataAddressTypes.MDSOnRequestOffer) {
    icon = "contact";
  } else if (type === DataAddressTypes.HttpData) {
    icon = "upload";
  } else {
    icon = "sim_card"
  }

  return <Icon {...rest}>{icon}</Icon>;
}
