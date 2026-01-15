import { InfoOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { TextFieldProps } from "@mui/material/TextField";
import { MuiChipsInput } from 'mui-chips-input';
import React from "react";

const chipKeyCodes = [",", ";", "Enter"];

export type KeywordsInputProps = Omit<TextFieldProps, "onChange"> & {
  error: boolean;
  tooltip?: string,
  label?: string,
  placeholder?: string,
  value: string[];
  onChange: (value: string[]) => void;
};

export function KeywordsInput({ tooltip = "", label = "", placeholder = "", error, value, onChange, }: KeywordsInputProps): React.ReactElement {
  const onDelete = (chip: string, index: number) => {
    value.splice(index, 1);
    return onChange(value);
  };

  return (
    <FormControl fullWidth>
      <MuiChipsInput
        addOnWhichKey={chipKeyCodes}
        fullWidth
        label={label}
        color="secondary"
        variant={"outlined"}
        placeholder={placeholder}
        value={value || []}
        onChange={onChange}
        error={error}
        slotProps={{
          inputLabel: (label === "" ? { shrink: true } : {}),
          input: {
            classes: { root: "!pr-2.5" },
            endAdornment: <Tooltip title={tooltip}>
              <IconButton >
                <InfoOutlined />
              </IconButton>
            </Tooltip>
          },
        }}
      />
    </FormControl>
  );
}
