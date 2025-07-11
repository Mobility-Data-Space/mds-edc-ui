import { IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { AtomicConstraint } from "@think-it-labs/edc-connector-client";
import { Minus } from "lucide-react";

import { Input } from "@/components/atoms/input";
import { MuiSelect } from "@/components/atoms/mui-select";
import { ConstraintProps } from "@/components/molecules/constraint";

import { T } from "@/i18n";
import { consumerParticipantIdOperators } from "@/utilities/policy-operators";

export function ConsumerParticipantIdConstraint({ value, onChange, onRemove }: ConstraintProps) {
  value = value as AtomicConstraint;

  return (
    <div className="flex flex-row gap-4">
      <Typography variant="body2">
        <T string="dataOffer.new.policyExpressionConsumerParticipantId" />
      </Typography>
      <MuiSelect label="participant-id" options={consumerParticipantIdOperators} value={value.operator}
        onChange={(event) => onChange({ ...value, operator: event.target.value })} />
      <Input id="participant-id-field" error={!value.rightOperand} value={value.rightOperand} onChange={(event) => onChange({ ...value, rightOperand: event.target.value })} />
      <div className="flex items-center">
        <IconButton
          size="large"
          onClick={onRemove}
          className="font-medium !-mt-5"
          color="secondary"
        >
          <Minus className="size-6" />
        </IconButton>
      </div>
    </div>
  );
}
