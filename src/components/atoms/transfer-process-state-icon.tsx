import React from "react";
import {CircularProgress, Icon, IconProps, Tooltip} from "@mui/material";

import {Asset} from "@think-it-labs/edc-connector-client";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld";

import { DataAddressTypes } from "@/utilities/data-address";
import {TransferProcess} from "@think-it-labs/edc-connector-client/dist/src/entities";
import {STATE_ERROR, STATE_RUNNING} from "@/constants/transfer-process.ts";
import {T} from "@/i18n";

export function TransferProcessStateIcon({ transferProcess }: { transferProcess: TransferProcess }) {
  if (transferProcess.state === STATE_RUNNING) {
    return <CircularProgress size={15} />;
  }
  if (transferProcess.state === STATE_ERROR) {
    return <Tooltip title={<T string="common.somethingWentWrong" />} >
      <Icon color="error" style={{ fontSize: "15px" }}>warning</Icon>
    </Tooltip>;
  }

  return "";
}
