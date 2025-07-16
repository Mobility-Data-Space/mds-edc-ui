import {Chip, StepIcon as MuiStepIcon, StepIconProps} from "@mui/material";
import React from "react";
import {CreateSharp as CreateIcon} from "@mui/icons-material";

export function StepIcon({ completed, active, icon, ...props }: StepIconProps): JSX.Element {
  return (
    <MuiStepIcon
      {...props}
      color="secondary"
      icon={! completed ?
        icon :
        <Chip
          label={<CreateIcon sx={{ fontSize: "14px", padding: 0 }} />}
          size="small"
          color="primary"
          sx={{ "& .MuiChip-label": {
            paddingLeft: "4px",
            paddingRight: "4px",
          } }}
        />
      }
      active={active}
      completed={completed}
    />
  );
}
