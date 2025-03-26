import React from "react";
import {TextField, Tooltip, IconButton} from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField/TextField";
import { InfoOutlined } from "@mui/icons-material";

export function Input({ tooltip = "", onChange, value, ...rest }: TextFieldProps & { tooltip?: string }): JSX.Element {

  return (
    <TextField
      fullWidth
      slotProps={{ input: {
        endAdornment: ! tooltip ? "" : <Tooltip title={tooltip}><IconButton><InfoOutlined /></IconButton></Tooltip>
        },
      }}
      label={rest.label}
      variant="outlined"
      placeholder={rest.placeholder}
      {...rest}
      value={value}
      onChange={onChange}
    />
  );
}
