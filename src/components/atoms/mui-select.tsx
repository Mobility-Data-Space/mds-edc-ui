import React, {ReactNode, useEffect} from "react";
import { Select, SelectProps as MuiSelectProps, MenuItem, InputLabel, FormHelperText} from "@mui/material";
import Divider from '@mui/material/Divider';
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

type Option = { text?: string; value: string };

export type SelectProps = Partial<MuiSelectProps> & {
  options: Option[],
  highlights?: Option[],
  defaultValue?: string,
  id?: string,
  label?: string
  required?: boolean,
  onChange: (event: any) => void,
  placeholder?: string,
  helperText?: ReactNode,
};

export function renderSelectOptions(options: Option[]): JSX.Element[] {
  return options?.map((option: Option) => (
    <MenuItem key={`${option.text}:${option.value}`} value={option.value}>
      {option.text || option.value}
    </MenuItem>
  ));
}

export function renderSelectValue(value: unknown, placeholder: string = "", options: Option[] = [], highlights: Option[] = []) {
  if (!value) {
    return <Typography color="gray">{placeholder}</Typography>;
  }

  const searchFunc = (option: Option) => option.value === value;
  const option = highlights.filter(searchFunc).pop() || options.filter(searchFunc).pop();
  return <>{option && option.text ? option.text : value}</>;
}

export function MuiSelect({ label, options, highlights = [], id = "", defaultValue = "", name, value = "", error = false, onChange, placeholder = "", required = false, disabled = false, helperText = "" }: SelectProps): JSX.Element {
  const hasHighlights = highlights && highlights.length > 0;
  const notValue = ! value;
  useEffect(() => {
    if (defaultValue && name && notValue) {
      onChange(defaultValue)
    }
  }, [defaultValue, name, onChange, notValue]);

  return (
    <FormControl fullWidth disabled={disabled} required={required} color="secondary">
      <InputLabel>{label}</InputLabel>
      <Select
        id={id}
        inputProps={{ 'data-testid': id }}
        disabled={disabled}
        color="secondary"
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
      <FormHelperText>
        {helperText}
      </FormHelperText>
    </FormControl>

  );
}
