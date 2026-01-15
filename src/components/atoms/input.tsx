import { InfoOutlined } from "@mui/icons-material";
import { IconButton, TextField, Tooltip } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";
import React, { ForwardedRef, forwardRef } from "react";

export const Input = forwardRef(({ tooltip = "", onChange, value, error, ...rest }: Omit<TextFieldProps, "error"> & { tooltip?: string, error?: string | boolean }, ref: ForwardedRef<HTMLInputElement>): React.ReactElement => {

  return (
    <TextField
      color="secondary"
      fullWidth
      label={rest.label}
      variant="outlined"
      placeholder={rest.placeholder}
      helperText={typeof error === "string" ? error : ""}
      {...rest}
      error={!!error}
      slotProps={{
        input: {
          endAdornment: !tooltip ? "" : <Tooltip title={tooltip}><IconButton><InfoOutlined /></IconButton></Tooltip>
        },
        ...rest.slotProps
      }}
      value={value === null || value === undefined ? "" : value}
      onChange={onChange}
      inputRef={ref}
    />
  );
})

Input.displayName = "Input"
