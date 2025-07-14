import React from "react";
import {TextField, Tooltip, IconButton, Icon} from "@mui/material";
import {Input} from "@/components/atoms/input";
import { TextFieldProps } from "@mui/material/TextField";
import { InfoOutlined } from "@mui/icons-material";
import {T} from "@/i18n";
import LinkIcon from "@mui/icons-material/Link";

export interface EdcInfoDisplayInputProps {
  value: string,
  translator: (key: string) => string,
  "data-testid"?: string,
}

export function EdcInfoDisplayInput({ translator, label, value, "data-testid": dataTestId, ...rest }: Omit<TextFieldProps, "error"> & EdcInfoDisplayInputProps): JSX.Element {
  return (

    <Input
      fullWidth
      label={label}
      value={value}
      data-testid={dataTestId}
      slotProps={{
        input: {
          classes: { root: "flex-grow" },
          startAdornment: <LinkIcon className="mr-2" />,
          endAdornment: <Tooltip title={translator("common.copyToClipboard")}>
            <IconButton color="secondary" onClick={() => navigator.clipboard.writeText(value)}>
              <Icon>content_copy</Icon>
            </IconButton>
          </Tooltip>
        }
      }}
      {...rest}
    />
  );
}
