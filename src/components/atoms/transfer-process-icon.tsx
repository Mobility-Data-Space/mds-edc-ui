import React from "react";
import {Icon, IconProps} from "@mui/material";

import {Asset} from "@think-it-labs/edc-connector-client";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld";

import { DataAddressTypes } from "@/utilities/data-address";
import {TransferProcess} from "@think-it-labs/edc-connector-client/dist/src/entities";

export function TransferProcessIcon({ transferProcess, ...rest }: { transferProcess: TransferProcess } & IconProps): JSX.Element {
  let icon;

  if (transferProcess.type === "CONSUMER") {
    icon = "upload";
  } else if (transferProcess.type === "PROVIDER") {
    icon = "download";
  } else {
    icon = ""
  }

  return <Icon {...rest}>{icon}</Icon>;
}
