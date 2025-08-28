import { Input } from "@/components/atoms/input";
import { MuiSelect } from "@/components/atoms/mui-select";
import { ConstraintProps } from "@/components/molecules/constraint";
import { T, useTranslator } from "@/i18n";
import { consumerParticipantIdOperators } from "@/utilities/policy-operators";
import { FormHelperText, Icon, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { AtomicConstraint } from "@think-it-labs/edc-connector-client";

export function ConsumerParticipantIdConstraint({ value, onChange, onRemove }: ConstraintProps) {
  value = value as AtomicConstraint;
  const { translator } = useTranslator();

  return (
    <div className="flex flex-row gap-5">
      <div className="flex flex-col">
        <Typography variant="body2">
          <T string="dataOffer.new.policyExpressionConsumerParticipantId" />
        </Typography>
      </div>
      <div className="flex flex-col flex-shrink-0 min-w-[140px]">
        <MuiSelect
          label={translator("dataOffer.new.policyExpressionOperator")}
          options={consumerParticipantIdOperators}
          value={value.operator}
          onChange={(event) => onChange({ ...value, operator: event.target.value })} />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row items-center gap-2">
          <Input
            label={translator("dataOffer.new.policyExpressionConsumerParticipantIdLabel")}
            required
            data-testid="participant-id-field"
            placeholder={translator("dataOffer.new.policyExpressionConsumerParticipantIdExamples")}
            error={!value.rightOperand} value={value.rightOperand}
            onChange={(event) => onChange({ ...value, rightOperand: event.target.value })} />
          <IconButton
            size="large"
            onClick={onRemove}
            className="font-medium"
            color="secondary"
          >
            <Icon style={{ fontSize: "28px" }} >remove</Icon>
          </IconButton>
        </div>
        <FormHelperText className="flex flex-row">
          <T string="dataOffer.new.policyExpressionConsumerParticipantIdTooltip" />
        </FormHelperText>
      </div>
    </div>
  );
}
