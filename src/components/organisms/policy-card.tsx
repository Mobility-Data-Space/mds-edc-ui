import React from "react";
import Typography from "@mui/material/Typography";
import {Card, CardContent, Icon} from "@mui/material";
import {PolicyDefinition} from "@think-it-labs/edc-connector-client";
import {ContractAgreementView} from "@think-it-labs/edc-connector-ui/contract-agreement-view.tsx";
import {T} from "@/i18n";
import {useParticipantConnectorState} from "@/hooks/use-participant-connector-state.ts";
import {PolicyDefinitionsList} from "@think-it-labs/edc-connector-ui/policy-definitions-list.tsx";
import {ContractDefinitionsList} from "@think-it-labs/edc-connector-ui/contract-definitions-list.tsx";
import {convertOdrlToJsonHtml, removeJsonLdSchemaFromProperties} from "@/utilities/catalog.ts";
import {Timestamp} from "@think-it-labs/edc-connector-ui/timestamp.tsx";
import {ConstraintShow} from "@/components/molecules/constraint-show.tsx";

interface Constraint {
  operandLeft?: { "@value": string }[],
  leftOperand?: { "@value": string }[],
  operator?: { "@value": string }[];
  operandRight?: { "@value": string }[],
  rightOperand?: { "@value": string }[],
}

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
  const { connector } = useParticipantConnectorState();

  return (
    <ContractAgreementView id={policyDefinition.id} managementUrl={connector.managementUrl}>
      <Card className="w-[400px]" onClick={onClick}>
        <CardContent className="flex flex-col gap-y-3">
          <div>
            <div className="flex gap-x-4">
              <div className="flex items-center">
                <Icon fontSize="large">policy</Icon>
              </div>
              <div>
                <Typography variant="h5" className="!leading-none hover:underline cursor-pointer">
                  {policyDefinition.id}
                </Typography>
              </div>
            </div>

            <div>
              <Typography variant="body2" color="textDisabled">
                <T string="policyDefinitions.headingCreatedAt"/>
              </Typography>
              <Typography variant="body2">
                <Timestamp seconds={policyDefinition.createdAt} />
              </Typography>
            </div>

            <ConstraintShow data={getConstraintData(policyDefinition)} />

          </div>
        </CardContent>
      </Card>
    </ContractAgreementView>
  );
}
