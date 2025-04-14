import Typography from "@mui/material/Typography";
import {T} from "@/i18n";
import {MuiSelect} from "@/components/atoms/mui-select.tsx";
import {timeRestrictionOperators} from "@/constants/constraints.ts";
import {DatePicker} from "@/components/atoms/date-picker.tsx";
import {IconButton} from "@mui/material";
import {Minus} from "lucide-react";
import * as React from "react";

import {ConstraintProps} from "@/components/molecules/constraint.tsx";

export function TimeRestrictionConstraint({value, onChange, onRemove}: ConstraintProps) {
  return (
    <div className="flex flex-row gap-4">
      <Typography variant="body2">
        <T string="dataOffer.new.policyExpressionTimeSpanRestriction"/>
      </Typography>
      <MuiSelect options={timeRestrictionOperators} value={value.operator}
                 onChange={(event) => onChange({...value, operator: event.target.value})}/>
      <DatePicker
        onChange={(dateValue) => onChange({...value, right: dateValue})}
        value={value.right as string}
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
