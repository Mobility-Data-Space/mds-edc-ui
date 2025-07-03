import * as React from "react";
import {Minus} from "lucide-react";
import {IconButton} from "@mui/material";
import Typography from "@mui/material/Typography";
import { AtomicConstraint } from "@think-it-labs/edc-connector-client";

import {MuiSelect} from "@/components/atoms/mui-select";
import {DatePicker} from "@/components/atoms/date-picker";
import {ConstraintProps} from "@/components/molecules/constraint";

import {T} from "@/i18n";
import { timeRestrictionOperators } from "@/utilities/policy-operators";

export function TimeRestrictionConstraint({value, onChange, onRemove}: ConstraintProps) {
  value = value as AtomicConstraint
  return (
    <div className="flex flex-row gap-4">
      <Typography variant="body2">
        <T string="dataOffer.new.policyExpressionTimeSpanRestriction"/>
      </Typography>
      <MuiSelect label="time-restriction" options={timeRestrictionOperators} value={value.operator}
                 onChange={(event) => onChange({...value, operator: event.target.value})}/>
      <DatePicker
        onChange={(dateValue) => onChange({...value, rightOperand: dateValue})}
        value={value.rightOperand as string}
      />
      <IconButton
        size="large"
        onClick={onRemove}
        className="font-medium !p-0 !-mt-5"
        color="secondary"
      >
        <Minus className="size-6"/>
      </IconButton>
    </div>
  );
}
