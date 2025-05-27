import React from "react";
import {Icon, IconProps} from "@mui/material";

import {Asset} from "@think-it-labs/edc-connector-client";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";

import { DataAddressTypes } from "@/utilities/data-address";

export function AssetIcon({ asset, ...rest }: { asset: Asset } & IconProps): JSX.Element {
  let icon;

  if (readValue(asset.dataAddress, "type") === DataAddressTypes.MDSOnRequestOffer) {
    icon = "contact";
  } else if (readValue(asset.dataAddress, "type") === DataAddressTypes.HttpData) {
    icon = "upload";
  } else {
    icon = "sim_card"
  }

  return <Icon {...rest}>{icon}</Icon>;
}
