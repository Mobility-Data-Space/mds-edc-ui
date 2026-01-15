import { CheckboxProps, FormControlLabel, FormControlLabelProps, Checkbox as MuiCheckbox } from '@mui/material';
import React from "react";

export function Checkbox({ label, onChange, value, onClick }: Omit<FormControlLabelProps, "control" | "onChange"> & CheckboxProps & { value: boolean }): React.ReactElement {

  return (
    <FormControlLabel
      control={<MuiCheckbox
        color="secondary"
        checked={value}
        onChange={onChange}
      />}
      onClick={onClick}
      label={label}
    />
  );
}
