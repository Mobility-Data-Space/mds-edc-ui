import * as React from "react";
import { DATE_FORMAT } from "@/utilities/date";

import dayjs, { Dayjs } from "dayjs";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DatePicker as MuiDatePicker,
  DatePickerFieldProps,
  DatePickerProps as MuiDatePickerProps,
} from "@mui/x-date-pickers/DatePicker";
import {
  useSplitFieldProps,
  usePickerContext,
} from "@mui/x-date-pickers/hooks";
import { useValidation, validateDate } from "@mui/x-date-pickers/validation";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function FreeTypingField(props: DatePickerFieldProps) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, "date");
  const pickerContext = usePickerContext();
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    if (pickerContext.value && pickerContext.value.isValid()) {
      setInputValue(pickerContext.value.format(pickerContext.fieldFormat));
    }
  }, [pickerContext.value, pickerContext.fieldFormat]);

  const { hasValidationError } = useValidation({
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: {
      ...internalProps,
      minDate: dayjs("0001-01-01", "YYYY-MM-DD"),
      maxDate: dayjs("9999-12-30", "YYYY-MM-DD"),
    },
    validator: validateDate,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleBlur = () => {
    const newValue = dayjs(inputValue);
    pickerContext.setValue(newValue);
  };

  const openPickerIcon = (
    <IconButton
      onClick={() => pickerContext.setOpen((prev) => !prev)}
      size="small"
    >
      <CalendarMonthIcon fontSize="small" />
    </IconButton>
  );

  const inputProps: TextFieldProps["InputProps"] = {
    endAdornment: (
      <InputAdornment position="end">{openPickerIcon}</InputAdornment>
    ),
  };

  return (
    <TextField
      {...forwardedProps}
      InputProps={inputProps}
      sx={{ width: "100%" }}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      error={hasValidationError}
      helperText={DATE_FORMAT}
      ref={pickerContext.rootRef}
      label={pickerContext.label}
      focused={pickerContext.open}
      placeholder="Type a date..."
    />
  );
}

export type DatePickerProps = Partial<MuiDatePickerProps<any>> & {
  name?: string;
  id?: string;
  label?: string;
  onChange: (value: Dayjs | null) => void;
  value: Dayjs | null;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
};

export function DatePicker({
  name = "",
  id = "",
  label = "",
  onChange,
  value,
  error = false,
  errorMessage,
  helperText,
}: DatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        slots={{
          field: FreeTypingField,
          openPickerIcon: CalendarMonthIcon,
        }}
        maxDate={dayjs("9999-12-30", "YYYY-MM-DD")}
        minDate={dayjs("0001-01-01", "YYYY-MM-DD")}
        slotProps={{
          popper: { placement: "bottom-start" },
          field: {
            id,
          },
          openPickerButton: { size: "small" },
        }}
      />
    </LocalizationProvider>
  );
}
