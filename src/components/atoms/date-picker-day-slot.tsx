import {PickersDay, PickersDayProps} from "@mui/x-date-pickers";
import {Dayjs} from "dayjs";
import React from "react";
import {theme} from "@/theme/ThemeProvider.tsx";

export type DaySlotCustomProps = PickersDayProps<any> & {
  dayjsStartDate?: Dayjs | null,
  dayjsEndDate?: Dayjs | null,
  bothDatesAreSet?: boolean,
}

export const DatePickerDaySlot = React.forwardRef(
  function DatePickerDaySlot({ dayjsStartDate = null, dayjsEndDate = null, bothDatesAreSet = false, ...props }: DaySlotCustomProps) {
    const isStartDate = props.day.isSame(dayjsStartDate, "day");
    const isEndDate = props.day.isSame(dayjsEndDate, "day");
    const isWithinPeriod = props.day.isAfter(dayjsStartDate, "day") && props.day.isBefore(dayjsEndDate, "day");
    const dayHighlighted = props.selected || isEndDate;
    const highlightColor = theme.palette.action.disabled;

    return (
      <div
        key={props.day.toString()}
        style={{
          position: "relative",
          ...(isWithinPeriod ? { backgroundColor: highlightColor } : {})
        }}
      >
        {! dayHighlighted ? "" :
          <div style={{
            backgroundColor: highlightColor,
            width: bothDatesAreSet ? "50%" : "",
            height: "100%",
            zIndex: 1,
            position: "absolute",
            [isStartDate ? "right" : "left"]: 0,
          }}></div>
        }
        <PickersDay
          {...props}
          sx={{
            "&.MuiPickersDay-root.Mui-selected": {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.light,
            } as any
          }}
          color="secondary"
          selected={dayHighlighted}
          style={{ zIndex: 2 }}
        />
      </div>
    );
  }
);
