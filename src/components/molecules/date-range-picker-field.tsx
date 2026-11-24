import React from "react";
import { Icon, IconButton, InputAdornment, TextField } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";
import { DatePickerFieldProps } from "@mui/x-date-pickers/DatePicker";
import {
  usePickerAdapter,
  usePickerContext,
  usePickerTranslations,
} from "@mui/x-date-pickers/hooks";
import { CalendarIcon } from "@mui/x-date-pickers/icons";

export type DateRangePickerFieldSlotProps = DatePickerFieldProps &
  Pick<TextFieldProps, "id" | "label" | "helperText" | "fullWidth" | "placeholder"> & {
    displayedValue: string;
    onClearClicked: () => void;
    hasError?: boolean;
  };

const noop = () => {};

export function DateRangePickerFieldSlot(props: DateRangePickerFieldSlotProps) {
  const pickerContext = usePickerContext();
  const adapter = usePickerAdapter();
  const translations = usePickerTranslations();
  const openPickerAriaLabel = translations.openDatePickerDialogue(
    adapter.isValid(pickerContext.value)
      ? adapter.format(pickerContext.value, "fullDate")
      : null,
  );

  return (
    <TextField
      color="secondary"
      id={props.id}
      label={props.label}
      error={props.hasError}
      helperText={props.helperText}
      fullWidth={props.fullWidth}
      value={props.displayedValue}
      onChange={noop}
      placeholder={props.placeholder}
      slotProps={{
        input: {
          ref: pickerContext.triggerRef,
          endAdornment: (
            <>
              {props.displayedValue && (
                <IconButton aria-label="close" onClick={props.onClearClicked}>
                  <Icon>close</Icon>
                </IconButton>
              )}
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  style={{ borderRadius: "50%" }}
                  aria-label={openPickerAriaLabel}
                  disabled={pickerContext.triggerStatus === "disabled"}
                  onClick={(event) => {
                    event.preventDefault();
                    pickerContext.setOpen((prev) => !prev);
                  }}
                >
                  <CalendarIcon />
                </IconButton>
              </InputAdornment>
            </>
          ),
        },
      }}
    />
  );
}
