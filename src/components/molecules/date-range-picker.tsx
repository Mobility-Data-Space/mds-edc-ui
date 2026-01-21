import React from 'react';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import {DATE_FORMAT, dateToString, DateType} from "@/utilities/date";
import {DateRangePickerTextFieldSlot, DateRangePickerTextFieldSlotProps} from "@/components/molecules/date-range-picker-text-field";
import {DatePickerDaySlot, DaySlotCustomProps} from "@/components/atoms/date-picker-day-slot";

type SlotProps = { textField: Partial<DateRangePickerTextFieldSlotProps>, day: Partial<DaySlotCustomProps> };

export interface DateRangePickerProps {
  name?: string;
  id?: string;
  label?: React.ReactNode;
  helperText?: string;
  onChange: (value: [string, string]) => void,
  value: [string, string],
  error?: boolean,
}

export default function DateRangePicker({ name = "", id = "", label = "", helperText = "", onChange, value, error }: DateRangePickerProps) {
  const startDate = value[0];
  const endDate = value[1];
  const [datesPicked, setDatesPicked] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const dayjsStartDate =  dayjs(startDate, DATE_FORMAT);
  const dayjsEndDate =  dayjs(endDate, DATE_FORMAT);
  const startDateString = dateToString(startDate);
  const endDateString = dateToString(endDate);

  const formattedOnChange = ([startDate, endDate]: [DateType | string, DateType | string]) => {
    return onChange([dateToString(startDate), dateToString(endDate)]);
  };

  const onClearClicked = () => {
    formattedOnChange(["", ""])
    setDatesPicked(0);
  };

  const datePickerOnChange = (date: any) => {
    setDatesPicked(datesPicked + 1);
    if (datesPicked % 2 === 0) {
      formattedOnChange([date, null]);
      return;
    }

    if (dayjs(date).isBefore(dayjsStartDate, "day")) {
      formattedOnChange([date, startDate]);
    } else {
      formattedOnChange([startDate, date]);
    }

    setIsOpen(false);
  };

  const slotProps: SlotProps = {
    textField: {
      id,
      hasError: error,
      helperText,
      label,
      fullWidth: true,
      placeholder: `${DATE_FORMAT} (inclusive)`,
      displayedValue: ! startDateString && !endDateString ? "" : `${startDateString} - ${endDateString}`,
      onClearClicked,
    },
    day: {
      bothDatesAreSet: !!startDate && !! endDate,
      dayjsStartDate,
      dayjsEndDate,
    },
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        name={name}
        enableAccessibleFieldDOMStructure={false}
        value={dayjs(startDate, DATE_FORMAT)}
        defaultValue={dayjs(new Date())}
        format={DATE_FORMAT}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        onChange={datePickerOnChange}
        closeOnSelect={false}
        slots={{
          textField: DateRangePickerTextFieldSlot,
          day: DatePickerDaySlot as any
        }}
        slotProps={slotProps}
      />
    </LocalizationProvider>
  );
}
