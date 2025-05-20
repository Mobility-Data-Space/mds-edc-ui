import {Asset} from "@think-it-labs/edc-connector-client";
import {Icon, IconProps} from "@mui/material";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import React from "react";

import {DATA_OFFER_TYPE} from "@/schema/asset.ts";
import {DATA_OFFER_TYPE_LIVE, DATA_OFFER_TYPE_ON_REQUEST} from "@/constants/data-address-types.ts";


export function AssetIcon({ asset, ...rest }: { asset: Asset } & IconProps): JSX.Element {
  // TODO: if at least one contract offer is done, add check icon overlay
  let icon;

  if (readValue(asset.dataAddress, DATA_OFFER_TYPE) === DATA_OFFER_TYPE_ON_REQUEST.value) {
    icon = "contact";
  } else if (readValue(asset.dataAddress, DATA_OFFER_TYPE) === DATA_OFFER_TYPE_LIVE.value) {
    icon = "upload";
  } else {
    icon = "sim_card"
  }

  return <Icon {...rest}>{icon}</Icon>;
}
