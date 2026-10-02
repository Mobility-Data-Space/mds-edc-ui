import React from "react";
import { CircularProgress, Icon, Tooltip } from "@mui/material";

import { TransferProcess } from "@think-it-labs/edc-connector-client/dist/src/entities";
import { STATE_ERROR, STATE_RUNNING } from "@/constants/transfer-process";
import { T } from "@/i18n";
import { toUiTransferProcessState } from "@/utilities/transfer-process-state";

export function TransferProcessStateIcon({
  transferProcess,
}: {
  transferProcess: TransferProcess;
}) {
  const uiState = toUiTransferProcessState(transferProcess);
  if (uiState === STATE_RUNNING) {
    return <CircularProgress size={15} />;
  }
  if (uiState === STATE_ERROR) {
    return (
      <Tooltip title={<T string="common.somethingWentWrong" />}>
        <Icon color="error" style={{ fontSize: "15px" }}>
          warning
        </Icon>
      </Tooltip>
    );
  }

  return "";
}
