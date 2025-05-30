import React from 'react';
import {DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import {DATE_FORMAT, dateToString} from "@/utilities/date";
import {DatePickerDaySlot} from "@/components/atoms/date-picker-day-slot";

export type DatePickerPros = Partial<MuiDatePickerProps<any>> & {
  name?: string,
  id?: string,
  label?: string
  onChange: (value: string) => void,
  value: string,
  error?: boolean,
};

export function DatePicker({ name = "", id = "", label = "", onChange, value, error = false }: DatePickerPros): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        name={name}
        value={dayjs(value, DATE_FORMAT)}
        defaultValue={dayjs(new Date())}
        format={DATE_FORMAT}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        onChange={(date) => {
          onChange(dateToString(date));
          setIsOpen(false);
        }}
        closeOnSelect={false}
        slots={{ day: DatePickerDaySlot as any }}
        slotProps={{
          textField: {
            id,
            error,
            label,
            color: "secondary",
            fullWidth: true,
            helperText: DATE_FORMAT,
            placeholder: "Date",
          }
        }}
      />
    </LocalizationProvider>
  );
}
