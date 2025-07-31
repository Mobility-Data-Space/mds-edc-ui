import React, {ReactNode, useEffect, useState} from "react";
import {Select, SelectProps as MuiSelectProps, MenuItem, InputLabel, FormHelperText, Divider, FormControl, Typography, Stack} from "@mui/material";
import {Checkbox} from "@/components/atoms/checkbox.tsx";

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

function valueIsEmpty(value: unknown): boolean {
  return (Array.isArray(value) && value.length === 0) || ! value;
}

export function renderSelectOptions(options: Option[], value: unknown): JSX.Element[] {
  if (options.length === 0) {
    return [<MenuItem key="hyphen-option">-</MenuItem>]
  }

  let isMultiple = false;
  if (Array.isArray(value)) {
    isMultiple = true;
  }

  return options?.map((option: Option) => (
    <MenuItem key={`${option.text}:${option.value}`} value={option.value}>
      {isMultiple ?
        <Checkbox
          onClick={(event) => event.preventDefault()}
          label={option.text || option.value}
          value={(value as Array<string>).includes(option.value)}
        /> :
        (option.text || option.value)
      }
    </MenuItem>
  ));
}

export function renderSelectValue(value: unknown, placeholder: string = "", options: Option[] = [], highlights: Option[] = []) {
  if (!value) {
    return <Typography color="gray">{placeholder}</Typography>;
  }

  if (Array.isArray(value)) {
    return (
      <Stack gap={1} direction="row" flexWrap="wrap">
        {value.join(', ')}
      </Stack>
    );
  }

  const searchFunc = (option: Option) => option.value === value;
  const option = highlights.filter(searchFunc).pop() || options.filter(searchFunc).pop();
  return <>{option && option.text ? option.text : value}</>;
}

export function MuiSelect({ label, options, highlights = [], id = "", defaultValue = "", name, value = "", error = false, onChange, placeholder = "", required = false, disabled = false, helperText = "", multiple = false }: Omit<SelectProps, "label" | "error"> & { label?: string, error?: string | boolean }): JSX.Element {
  const hasHighlights = highlights && highlights.length > 0;
  const notValue = ! value;
  const [labelPlaceholder, setLabelPlaceholder] = useState(valueIsEmpty(value) ? "" : label);

  useEffect(() => {
    if (defaultValue && name && notValue) {
      onChange(defaultValue)
    }
  }, [defaultValue, name, onChange, notValue]);

  const onFocus = () => {
    if (valueIsEmpty(value)) {
      setLabelPlaceholder(label);
    }
  }

  const onBlur = () => {
    if (valueIsEmpty(value)) {
      setLabelPlaceholder("");
    }
  }

  return (
    <FormControl fullWidth disabled={disabled} required={required} color="secondary">
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        id={id}
        onFocus={onFocus}
        onBlur={onBlur}
        inputProps={{ 'data-testid': id }}
        disabled={disabled}
        color="secondary"
        required={required}
        label={labelPlaceholder}
        labelId={id}
        value={value || ""}
        defaultValue={defaultValue}
        fullWidth
        variant="outlined"
        onChange={(event) => onChange(event)}
        error={!!error}
        displayEmpty
        multiple={multiple}
        renderValue={(value) => renderSelectValue(value, placeholder, options, highlights)}
      >
        {hasHighlights && renderSelectOptions(highlights, value)}
        {hasHighlights && <Divider />}
        {renderSelectOptions(options, value)}
      </Select>
      <FormHelperText>
        {helperText}
      </FormHelperText>
    </FormControl>

  );
}
