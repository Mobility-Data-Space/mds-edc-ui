import {
  transferProcessStateBgColor,
  transferProcessStateTextColor,
} from "@/utilities/transfer-process.ts";
import { Chip, ChipProps } from "@mui/material";
import React from "react";

export function StateChip({
  state: _state,
  icon,
  didError,
  ...rest
}: { state: string; didError: boolean } & ChipProps): React.ReactElement {
  let state = _state;
  if (state === "DEPROVISIONED") {
    state = didError ? "TERMINATED" : "COMPLETED";
  }

  return (
    <Chip
      className="font-semibold"
      label={
        icon ? (
          <span className="flex items-center gap-x-2">
            {state} {icon}
          </span>
        ) : (
          state
        )
      }
      style={{
        backgroundColor: transferProcessStateBgColor(state),
        color: transferProcessStateTextColor(state),
      }}
      {...rest}
      icon={undefined}
    />
  );
}
