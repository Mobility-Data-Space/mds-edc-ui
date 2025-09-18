import React from "react";
import { Chip, ChipProps } from "@mui/material";
import { transferProcessStateBgColor, transferProcessStateTextColor } from "@/utilities/transfer-process.ts";

export function StateChip({ state, icon, ...rest }: { state: string } & ChipProps): JSX.Element {

  return <Chip
    className="font-semibold"
    label={icon ? <span className="flex items-center gap-x-2">{state} {icon}</span> : state}
    style={{
      backgroundColor: transferProcessStateBgColor(state),
      color: transferProcessStateTextColor(state)
    }}
    {...rest}
    icon={undefined}
  />;
}
