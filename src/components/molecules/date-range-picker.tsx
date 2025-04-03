import React, {Ref} from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useTheme } from '@mui/material/styles';
import { IconButton, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { TextFieldProps } from "@mui/material/TextField/TextField";

const DATE_FORMAT = 'DD/MM/YYYY';

type DateRangePickerTextFieldSlotProps = TextFieldProps &  {
  displayedValue: string,
  onClearClicked: () => void,
  hasError?: boolean,
  InputProps: {
    ref: Ref<HTMLInputElement>,
    endAdornment: Element,
  }
}

const DateRangePickerTextFieldSlot = React.forwardRef(
  function DateRangePickerTextFieldSlot (props: DateRangePickerTextFieldSlotProps) {
    return (
      <TextField
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
                <CloseIcon/>
              </IconButton>}
              {props.InputProps.endAdornment}
            </>,
          }
        }}
      />
    )
  }
);

type DaySlotCustomProps = PickersDayProps<any> & {
  highlightColor: string,
  dayjsStartDate: Dayjs,
  dayjsEndDate: Dayjs,
  bothDatesAreSet: boolean,
}

const DaySlot = React.forwardRef(
  function DaySlot({ highlightColor, dayjsStartDate, dayjsEndDate, bothDatesAreSet, ...props }: DaySlotCustomProps)  {
    const isStartDate = props.day.isSame(dayjsStartDate, "day");
    const isEndDate = props.day.isSame(dayjsEndDate, "day");
    const isWithinPeriod = props.day.isAfter(dayjsStartDate, "day") && props.day.isBefore(dayjsEndDate, "day");
    const dayHighlighted = props.selected || isEndDate;

    return (
      <div
        style={{
          position: "relative",
          ...(isWithinPeriod
            ? {
              backgroundColor: highlightColor,
            }
            : {})
        }}
        key={props.day.toString()}
      >
        {! dayHighlighted ? "" :
          <div style={{
            backgroundColor: highlightColor,
            width: (bothDatesAreSet) ? "50%" : "",
            height: "100%",
            zIndex: 1,
            position: "absolute",
            [isStartDate? "right" : "left"]: 0,
          }}></div>
        }
        <PickersDay {...props} selected={dayHighlighted} style={{ zIndex: 2 }} />
      </div>
    );
  }
);

export interface DateRangePickerProps {
  name?: string;
  id?: string;
  label?: React.ReactNode;
  helperText?: string;
  onChange: (value: [string, string]) => void,
  value: [string, string],
  error?: boolean,
}

type DateType = Dayjs | null;

const dateToString = (date?: DateType | string) => {
  if (typeof date === "string") {
    return date;
  }

  const dayjsDate = dayjs(date);
  return dayjsDate.isValid() ? dayjsDate.format(DATE_FORMAT) : "";
}

export default function DateRangePicker({ name = "", id = "", label = "", helperText = "", onChange, value, error }: DateRangePickerProps) {
  const theme = useTheme();
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        name={name}
        value={dayjs(startDate, DATE_FORMAT)}
        defaultValue={dayjs(new Date())}
        format={DATE_FORMAT}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        onChange={datePickerOnChange}
        closeOnSelect={false}
        slotProps={{
          textField: {
            id,
            hasError: error,
            helperText,
            label,
            fullWidth: true,
            placeholder: "Start date - end date (inclusive)",
            displayedValue: ! startDateString && !endDateString ? "" : `${startDateString} - ${endDateString}`,
            onClearClicked,
          },
          day: {
            highlightColor: theme.palette.action.disabled,
            bothDatesAreSet: !!startDate && !! endDate,
            dayjsStartDate,
            dayjsEndDate,
          },
        } as { textField: DateRangePickerTextFieldSlotProps, day: DaySlotCustomProps }}
        slots={{
          textField: DateRangePickerTextFieldSlot,
          day: DaySlot as any
        }}
      />
    </LocalizationProvider>
  );
}
