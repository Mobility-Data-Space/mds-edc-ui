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
  const fieldContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (pickerContext.value && pickerContext.value.isValid()) {
      setInputValue(pickerContext.value.format(pickerContext.fieldFormat));
    }
  }, [pickerContext.value, pickerContext.fieldFormat]);

  // Set the rootRef to our container
  const { rootRef } = pickerContext;
  React.useEffect(() => {
    if (fieldContainerRef.current && rootRef) {
      if (typeof rootRef === "function") {
        rootRef(fieldContainerRef.current);
      } else if (rootRef && "current" in rootRef) {
        // eslint-disable-next-line react-hooks/immutability -- MUI requires setting rootRef.current for proper positioning
        (rootRef as React.MutableRefObject<HTMLElement | null>).current =
          fieldContainerRef.current;
      }
    }
  }, [rootRef]);

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
    const newValue = dayjs(inputValue, DATE_FORMAT, true);
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
    <div
      ref={fieldContainerRef}
      style={{ width: "100%", position: "relative" }}
    >
      <TextField
        {...forwardedProps}
        InputProps={inputProps}
        sx={{ width: "100%" }}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        error={hasValidationError}
        helperText={DATE_FORMAT}
        label={pickerContext.label}
        focused={pickerContext.open}
        placeholder="Type a date..."
      />
    </div>
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
}: DatePickerProps) {
  const anchorRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={anchorRef} style={{ position: "relative", width: "100%" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
          <MuiDatePicker
            name={name}
            label={label}
            format={DATE_FORMAT}
            value={value}
            onChange={onChange}
            slots={{
              field: FreeTypingField,
            }}
            maxDate={dayjs("9999-12-30", "YYYY-MM-DD")}
            minDate={dayjs("0001-01-01", "YYYY-MM-DD")}
            slotProps={{
              popper: {
                sx: {
                  marginTop: "60px",
                  position: "absolute !important",
                },
                placement: "bottom-end",
                disablePortal: true, // important
              },
              field: {
                id,
                ref: anchorRef,
              },
              openPickerButton: { size: "small" },
            }}
          />
        </div>
      </LocalizationProvider>
    </div>
  );
}
