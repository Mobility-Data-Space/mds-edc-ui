import * as React from "react";
import { Icon, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { AtomicConstraint } from "@think-it-labs/edc-connector-client";
import { MuiSelect } from "@/components/atoms/mui-select";
import { DatePicker } from "@/components/atoms/date-picker";
import { ConstraintProps } from "@/components/molecules/constraint";
import { T, useTranslator } from "@/i18n";
import { DATE_FORMAT } from "@/utilities/date.ts";
import dayjs, { Dayjs } from "dayjs";
import { timeRestrictionOperators } from "@/utilities/policy-operators";

export function TimeRestrictionConstraint({
  value,
  onChange,
  onRemove,
}: ConstraintProps) {
  const [dateValue, setDateValue] = React.useState<Dayjs | null>(null);
  value = value as AtomicConstraint;

  React.useEffect(() => {
    function initializeDate() {
      const inputValue = value as AtomicConstraint;
      if (inputValue?.rightOperand) {
        const dayJsDate = dayjs(inputValue.rightOperand);
        if (dayJsDate.isValid()) {
          setDateValue(dayJsDate);
        }
      }
    }
    initializeDate();
  }, [value.rightOperand]);
  const dayJsDate = dayjs(value.rightOperand);
  const dateIsNotValid = !dayJsDate.isValid();
  const { translator } = useTranslator();

  const handleDateChange = (newValue: Dayjs | null) => {
    setDateValue(newValue);
    if (newValue?.isValid()) {
      onChange({
        ...value,
        rightOperand: dayjs(newValue, DATE_FORMAT).toISOString(),
      });
    } else {
      onChange({
        ...value,
        rightOperand: "",
      });
    }
  };
  return (
    <div className="flex flex-row gap-4">
      <Typography variant="body2">
        <T string="dataOffer.new.policyExpressionTimeSpanRestriction" />
      </Typography>
      <MuiSelect
        label="time-restriction"
        options={timeRestrictionOperators}
        value={value.operator}
        onChange={(event) =>
          onChange({ ...value, operator: event.target.value })
        }
      />

      <div className="relative w-full">
        <DatePicker
          label={`${translator(
            "dataOffer.new.policyExpressionTimeRestriction"
          )}*`}
          error={dateIsNotValid}
          onChange={handleDateChange}
          value={dateValue}
        />
      </div>

      <div className="flex items-center">
        <IconButton
          size="large"
          onClick={onRemove}
          className="font-medium !-mt-5"
          color="secondary"
        >
          <Icon style={{ fontSize: "28px" }}>remove</Icon>
        </IconButton>
      </div>
    </div>
  );
}
