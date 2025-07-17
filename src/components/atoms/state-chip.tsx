import React from "react";
import {Chip, ChipProps} from "@mui/material";
import {transferProcessStateColor} from "@/utilities/transfer-process.ts";

export function StateChip({ state, icon, ...rest }: { state: string } & ChipProps): JSX.Element {

  return <Chip
    className="font-semibold"
    label={icon ? <span className="flex items-center gap-x-2">{state} {icon}</span> : state}
    style={{ backgroundColor: transferProcessStateColor(state) }}
    {...rest}
    icon={undefined}
  />;
}
