import { proxyConnectorManagement } from "@/constants/proxy";
import { T } from "@/i18n";
import { removeJsonLdSchemaFromProperties } from "@/utilities/catalog";
import { Card, CardContent, Icon } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ContractDefinition } from "@think-it-labs/edc-connector-client";
import { ContractDefinitionView } from "@think-it-labs/edc-connector-ui/contract-definition-view";
import { ContractDefinitionsList } from "@think-it-labs/edc-connector-ui/contract-definitions-list";
import { getLiteral } from "@/jsonld/accessors";
import { clickableProps } from "@/utilities/a11y";


interface Constraint {
  operandLeft?: { "@value": string }[],
  leftOperand?: { "@value": string }[],
  operator?: { "@value": string }[];
  operandRight?: { "@value": string }[],
  rightOperand?: { "@value": string }[],
}

export interface ContractDefinitionCardProps {
  contractDefinition: ContractDefinition;
  onClick: () => void;
}

function getAssets(contractDefinition: ContractDefinition): string[] {
  const cleanContractDefinition = removeJsonLdSchemaFromProperties(contractDefinition);
  return (cleanContractDefinition?.assetsSelector || [])
    .map((constraint: Constraint) =>
      getLiteral(constraint.operandRight || constraint.rightOperand) ?? ""
    );
}

export default function ContractDefinitionCard({ contractDefinition, onClick }: ContractDefinitionCardProps) {
  return (
    <ContractDefinitionView id={contractDefinition.id} managementUrl={proxyConnectorManagement}>
      <Card className="data-offer-card w-full max-w-[368px]" {...clickableProps(onClick)}>
        <CardContent className="flex flex-col gap-y-3">
          <div>
            <div className="flex gap-x-4">
              <div className="flex items-center">
                <Icon fontSize="large">policy</Icon>
              </div>
              <div>
                <Typography variant="h4" className="!leading-none hover:underline cursor-pointer [word-break:break-word]" data-testid="contract-definition-id">
                  {contractDefinition.id}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  <T string="contractDefinitions.dataOffer" />
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-4 py-4">
              <div>
                <Typography variant="body2" color="textDisabled">
                  <T string="contractDefinitions.accessPolicy" />
                </Typography>
                <Typography variant="body2">
                  <ContractDefinitionsList.Policy
                    managementUrl={proxyConnectorManagement}
                    id={contractDefinition.accessPolicyId}
                  >
                    <ContractDefinitionsList.Policy.Id />
                    <br />
                    <span className="text-xs text-gray-800">
                      <ContractDefinitionsList.Policy.CreatedAt />
                    </span>
                  </ContractDefinitionsList.Policy>
                </Typography>
              </div>
              <div>
                <Typography variant="body2" color="textDisabled">
                  <T string="contractDefinitions.contractPolicy" />
                </Typography>
                <Typography variant="body2">
                  <ContractDefinitionsList.Policy
                    managementUrl={proxyConnectorManagement}
                    id={contractDefinition.contractPolicyId}
                  >
                    <ContractDefinitionsList.Policy.Id />
                    <br />
                    <span className="text-xs text-gray-800">
                      <ContractDefinitionsList.Policy.CreatedAt />
                    </span>
                  </ContractDefinitionsList.Policy>
                </Typography>
              </div>

              <div>
                <Typography variant="body2" color="textDisabled">
                  <T string="contractDefinitions.assets" />
                </Typography>
                <Typography variant="body2">
                  {getAssets(contractDefinition).join(", ")}
                </Typography>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </ContractDefinitionView>
  );
}
