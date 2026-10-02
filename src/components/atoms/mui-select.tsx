import { Checkbox } from "@/components/atoms/checkbox";
import { Divider, FormControl, FormHelperText, InputLabel, MenuItem, SelectProps as MuiSelectProps, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import React, { ReactNode, useState } from "react";

type Option = { text?: string; value: string };

type SelectValue = string | string[];

export type SelectProps<V extends SelectValue = string> = Omit<Partial<MuiSelectProps<V>>, "onChange"> & {
  options: Option[],
  highlights?: Option[],
  id?: string,
  label?: string
  required?: boolean,
  onChange: (event: SelectChangeEvent<V>) => void,
  placeholder?: string,
  helperText?: ReactNode,
};

function valueIsEmpty(value: unknown): boolean {
  return (Array.isArray(value) && value.length === 0) || !value;
}

function renderSelectOptions(options: Option[], value: unknown): React.ReactElement[] {
  let isMultiple = false;
  if (Array.isArray(value)) {
    isMultiple = true;
  }

  return options?.map((option: Option) => (
    <MenuItem key={`${option.text}:${option.value}`} value={option.value}  aria-label={option.text}>
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

function renderSelectValue(value: unknown, placeholder: string = "", options: Option[] = [], highlights: Option[] = []) {
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

export function MuiSelect<V extends SelectValue = string>({ label, options, highlights = [], id = "", defaultValue, value, error = false, onChange, placeholder = "", required = false, disabled = false, helperText = "", multiple = false }: Omit<SelectProps<V>, "label" | "error"> & { label?: string, error?: string | boolean }): React.ReactElement {
  const hasHighlights = highlights && highlights.length > 0;
  const [labelPlaceholder, setLabelPlaceholder] = useState(valueIsEmpty(value) ? "" : label);

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
      <Select<V>
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
