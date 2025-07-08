import * as React from "react";
import {Minus} from "lucide-react";
import Typography from "@mui/material/Typography";
import {IconButton} from "@mui/material";
import { AtomicConstraint } from "@think-it-labs/edc-connector-client";

import {MuiSelect} from "@/components/atoms/mui-select";
import {Input} from "@/components/atoms/input";
import {ConstraintProps} from "@/components/molecules/constraint";

import {T} from "@/i18n";
import { consumerParticipantIdOperators } from "@/utilities/policy-operators";

export function ConsumerParticipantIdConstraint({value, onChange, onRemove}: ConstraintProps) {
  value = value as AtomicConstraint ;

  return (
    <div className="flex flex-row gap-4">
      <Typography variant="body2">
        <T string="dataOffer.new.policyExpressionConsumerParticipantId"/>
      </Typography>
      <MuiSelect label="participant-id" options={consumerParticipantIdOperators} value={value.operator}
                 onChange={(event) => onChange({...value, operator: event.target.value})}/>
      <Input data-testid="participant-id-field" value={value.rightOperand} onChange={(event) => onChange({...value, rightOperand: event.target.value})}/>
      <div className="flex items-center">
        <IconButton
          size="large"
          onClick={onRemove}
          className="font-medium !-mt-5"
          color="secondary"
        >
          <Minus className="size-6"/>
        </IconButton>
      </div>
    </div>
  );
}
