import React, {Ref} from "react";
import {Icon, IconButton, TextField} from "@mui/material";
import {TextFieldProps} from "@mui/material/TextField";

export type DateRangePickerTextFieldSlotProps = TextFieldProps & {
  displayedValue: string,
  onClearClicked: () => void,
  hasError?: boolean,
  InputProps: {
    ref: Ref<HTMLInputElement>,
    endAdornment: Element,
  }
}

export const DateRangePickerTextFieldSlot = React.forwardRef(
  function DateRangePickerTextFieldSlot(props: DateRangePickerTextFieldSlotProps, ref) {
    return (
      <TextField
        color="secondary"
        id={props.id}
        label={props.label}
        error={props.hasError}
        helperText={props.helperText}
        fullWidth={props.fullWidth}
        value={props.displayedValue}
        onChange={props.onChange}
        placeholder={props.placeholder}
        slotProps={{
          input: {
            ref: props.InputProps.ref,
            endAdornment: <>
              {props.displayedValue && <IconButton
                aria-label="close"
                onClick={props.onClearClicked}
              >
                <Icon>close</Icon>
              </IconButton>}
              {props.InputProps.endAdornment}
            </>,
          }
        }}
      />
    )
  }
);
