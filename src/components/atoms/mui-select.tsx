import React, {useEffect} from "react";
import {Select, MenuItem, InputLabel} from "@mui/material";
import Divider from '@mui/material/Divider';
import {SelectInputProps} from "@mui/material/Select/SelectInput";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

type Option = { text?: string; value: string };

export type SelectProps = Partial<SelectInputProps> & {
  options: Option[],
  highlights?: Option[],
  defaultValue?: string,
  id?: string,
  label?: string
  required?: boolean,
  onChange: (event: any) => void,
  placeholder?: string,
};

export function renderSelectOptions(options: Option[]): JSX.Element[] {
  return options?.map((option: Option) => (
    <MenuItem key={`${option.text}:${option.value}`} value={option.value}>
      {option.text || option.value}
    </MenuItem>
  ));
}

export function renderSelectValue(value: unknown, placeholder: string = "", options: Option[] = [], highlights: Option[] = []) {
  console.log("not value")
  if (!value) {
    return <Typography color="gray">{placeholder}</Typography>;
  }

  const searchFunc = (option: Option) => option.value === value;
  const option = highlights.filter(searchFunc).pop() || options.filter(searchFunc).pop();
  return <>{option && option.text ? option.text : value}</>;
}

export function MuiSelect({ label, options, highlights = [], defaultValue = "", name, value = "", error = false, onChange, placeholder = "", required = false }: SelectProps): JSX.Element {
  const hasHighlights = highlights && highlights.length > 0;
  useEffect(() => {
    if (defaultValue && name && ! value) {
      onChange(defaultValue)
    }
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        required={required}
        label={label}
        value={value || ""}
        defaultValue={defaultValue}
        fullWidth
        variant="outlined"
        onChange={(event) => onChange(event)}
        error={error}
        displayEmpty
        renderValue={(value) => renderSelectValue(value, placeholder, options, highlights)}
      >

        {hasHighlights && renderSelectOptions(highlights)}
        {hasHighlights && <Divider />}
        {renderSelectOptions(options)}
      </Select>
    </FormControl>

  );
}
