import React from "react";
import {Checkbox as MuiCheckbox, CheckboxProps, FormControlLabel, FormControlLabelProps} from '@mui/material';

export function Checkbox({ label, onChange, value }: Omit<FormControlLabelProps, "control" | "onChange"> & CheckboxProps & { value: boolean }): JSX.Element {

  return (
    <FormControlLabel
      control={<MuiCheckbox
        color="secondary"
        checked={value}
        onChange={onChange}
      />}
      label={label}
    />
  );
}
