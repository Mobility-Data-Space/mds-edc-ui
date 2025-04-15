import Typography from "@mui/material/Typography";
import {T} from "@/i18n";
import {MuiSelect} from "@/components/atoms/mui-select.tsx";
import {consumerParticipantIdOperators} from "@/constants/constraints.ts";
import {Input} from "@/components/atoms/input.tsx";
import {IconButton} from "@mui/material";
import {Minus} from "lucide-react";
import * as React from "react";

import {ConstraintProps} from "@/components/molecules/constraint.tsx";

export function ConsumerParticipantIdConstraint({value, onChange, onRemove}: ConstraintProps) {
  return (
    <div className="flex flex-row gap-4">
      <Typography variant="body2">
        <T string="dataOffer.new.policyExpressionConsumerParticipantId"/>
      </Typography>
      <MuiSelect options={consumerParticipantIdOperators} value={value.operator}
                 onChange={(event) => onChange({...value, operator: event.target.value})}/>
      <Input value={value.right} onChange={(event) => onChange({...value, right: event.target.value})}/>
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
