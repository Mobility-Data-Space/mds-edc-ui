import {FormHelperText, Icon, IconButton} from "@mui/material";
import Typography from "@mui/material/Typography";
import { AtomicConstraint } from "@think-it-labs/edc-connector-client";
import { Input } from "@/components/atoms/input";
import { MuiSelect } from "@/components/atoms/mui-select";
import { ConstraintProps } from "@/components/molecules/constraint";
import { T, useTranslator } from "@/i18n";
import { consumerParticipantIdOperators } from "@/utilities/policy-operators";
import React from "react";

export function ConsumerParticipantIdConstraint({ value, onChange, onRemove }: ConstraintProps) {
  value = value as AtomicConstraint;
  const { translator } = useTranslator() ;

  return (
    <div className="flex flex-row gap-5">
      <div className="flex flex-col">
      <Typography variant="body2">
        <T string="dataOffer.new.policyExpressionConsumerParticipantId" />
      </Typography>
      </div>
      <div className="flex flex-col">
        <MuiSelect 
          label={translator("dataOffer.new.policyExpressionOperator")}
          options={consumerParticipantIdOperators} value={value.operator}
          onChange={(event) => onChange({ ...value, operator: event.target.value })} />
      </div>
      <div className="flex flex-col">
        <Input 
          data-testid="participant-id-field"
          placeholder={translator("dataOffer.new.policyExpressionConsumerParticipantIdExamples")}
          error={!value.rightOperand} value={value.rightOperand} 
          onChange={(event) => onChange({ ...value, rightOperand: event.target.value })} />
        <FormHelperText className="flex flex-row">
          <T string="dataOffer.new.policyExpressionConsumerParticipantIdTooltip"/>
        </FormHelperText>
      </div>
      <div className="flex">
        <IconButton
          size="large"
          onClick={onRemove}
          className="font-medium !-mt-1"
          color="secondary"
        >
          <Icon style={{ fontSize: "28px" }} >remove</Icon>
        </IconButton>
      </div>
    </div>
  );
}
