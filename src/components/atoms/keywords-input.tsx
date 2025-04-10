import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";
import { InfoOutlined } from '@mui/icons-material';
import ChipInput from 'material-ui-chip-input'
import FormControl from "@mui/material/FormControl";

const ENTER = 13;
const COMMA = 188;
const SEMICOLON = 186;
const chipKeyCodes = [ENTER, COMMA, SEMICOLON];

export type KeywordsInputProps = Omit<TextFieldProps, "onChange"> & {
  error: boolean;
  tooltip?: string,
  label?: string,
  placeholder?: string,
  value: string[];
  onChange: (value: string[]) => void;
};

export function KeywordsInput({ tooltip = "", label = "", placeholder = "", error, value, onChange, }: KeywordsInputProps): JSX.Element {
  const onDelete= (chip: string, index: number) => {
    value.splice(index, 1);
    return onChange(value);
  };

  return (
    <FormControl fullWidth>
      <ChipInput
        newChipKeyCodes={chipKeyCodes}
        fullWidth
        label={label}
        InputLabelProps={label === "" ? { shrink: true } : {}}
        variant={"outlined"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onDelete={onDelete}
        error={error}
        InputProps={{
          endAdornment: <Tooltip title={tooltip}>
            <IconButton classes={{ root: "!-mt-3.5" }}>
              <InfoOutlined />
            </IconButton>
          </Tooltip>
        }}
      />
    </FormControl>
  );
}
