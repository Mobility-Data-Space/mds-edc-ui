import {
  transferProcessStateBgColor,
  transferProcessStateTextColor,
} from "@/utilities/transfer-process.ts";
import { Chip, ChipProps } from "@mui/material";
import React from "react";

type StateChipProps = { state: string; didError: boolean } & ChipProps
export function StateChip({
  state,
  icon,
  didError,
  ...rest
}: StateChipProps): React.ReactElement {
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
