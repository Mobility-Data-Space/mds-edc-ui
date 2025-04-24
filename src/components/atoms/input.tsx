import React from "react";
import {TextField, Tooltip, IconButton} from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";
import { InfoOutlined } from "@mui/icons-material";

export function Input({ tooltip = "", onChange, value, ...rest }: TextFieldProps & { tooltip?: string }): JSX.Element {

  return (
    <TextField
      color="secondary"
      fullWidth

      label={rest.label}
      variant="outlined"
      placeholder={rest.placeholder}
      {...rest}
      slotProps={{
        input: {
          endAdornment: ! tooltip ? "" : <Tooltip title={tooltip}><IconButton><InfoOutlined /></IconButton></Tooltip>
        },
        ...rest.slotProps
      }}
      value={value}
      onChange={onChange}
    />
  );
}
