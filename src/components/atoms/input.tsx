import React from "react";
import {TextField, Tooltip, IconButton} from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";
import { InfoOutlined } from "@mui/icons-material";

export function Input({ tooltip = "", onChange, value, error, ...rest }: Omit<TextFieldProps, "error"> & { tooltip?: string, error?: string | boolean }): JSX.Element {

  return (
    <TextField
      color="secondary"
      fullWidth
      label={rest.label}
      variant="outlined"
      placeholder={rest.placeholder}
      helperText={typeof error === "string" ? error : ""}
      {...rest}
      error={!! error}
      slotProps={{
        input: {
          endAdornment: ! tooltip ? "" : <Tooltip title={tooltip}><IconButton><InfoOutlined /></IconButton></Tooltip>
        },
        ...rest.slotProps
      }}
      value={value === null || value === undefined ? "" : value}
      onChange={onChange}
    />
  );
}
