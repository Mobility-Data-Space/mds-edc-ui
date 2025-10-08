import React from "react";
import { Chip, ChipProps } from "@mui/material";
import {
  transferProcessStateBgColor,
  transferProcessStateTextColor,
} from "@/utilities/transfer-process.ts";

export function StateChip({
  state: _state,
  icon,
  didError,
  ...rest
}: { state: string; didError: boolean } & ChipProps): JSX.Element {
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
