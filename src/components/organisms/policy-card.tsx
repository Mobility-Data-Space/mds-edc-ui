import Typography from "@mui/material/Typography";
import { ContractAgreementView } from "@think-it-labs/edc-connector-ui/contract-agreement-view";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { Card, CardContent, Icon } from "@mui/material";
import { T } from "@/i18n";
import { PolicyDefinition } from "@think-it-labs/edc-connector-client";
import { Timestamp } from "@think-it-labs/edc-connector-ui/timestamp";
import { ConstraintShow } from "@/components/molecules/constraint-show";
import { convertOdrlToJsonHtml, removeJsonLdSchemaFromProperties } from "@/utilities/catalog";


export interface PolicyCardProps {
  policyDefinition: PolicyDefinition;
  onClick: () => void;
}

function getConstraintData(policyDefinition: PolicyDefinition) {
  const cleanPolicyDefinition = removeJsonLdSchemaFromProperties(policyDefinition);
  const policy = cleanPolicyDefinition?.policy && cleanPolicyDefinition?.policy[0];
  const permission = policy?.permission && policy?.permission[0];

  return convertOdrlToJsonHtml(permission?.constraint, ",");
}

export default function PolicyCard({ policyDefinition, onClick }: PolicyCardProps) {
  return (
    <Card className="policy-card w-full max-w-[500px]" onClick={onClick}>
      <CardContent className="flex flex-col gap-y-3">
        <div>
          <div className="flex gap-x-4">
            <div className="flex items-center">
              <Icon fontSize="large">policy</Icon>
            </div>
            <div>
              <Typography variant="h5" className="!leading-none hover:underline cursor-pointer [word-break:break-word]" data-testid="policy-id">
                {policyDefinition.id}
              </Typography>
            </div>
          </div>
          <div>
            <Typography variant="body2" color="textDisabled">
              <T string="policyDefinitions.headingCreatedAt" />
            </Typography>
            <Typography variant="body2">
              <Timestamp seconds={policyDefinition.createdAt} />
            </Typography>
          </div>
        </div>
        <ConstraintShow data={getConstraintData(policyDefinition)} />
      </CardContent>
    </Card>
  );
}
