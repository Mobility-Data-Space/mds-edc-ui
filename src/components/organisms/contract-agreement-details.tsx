import React, {useState, useEffect} from "react";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import { T } from "@/i18n";
import {Asset, ContractAgreement} from "@think-it-labs/edc-connector-client";
import {Icon} from "@mui/material";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon";
import {removeJsonLdSchemaFromProperties} from "@/utilities/catalog";
import Typography from "@mui/material/Typography";
import {contractAgreementFieldsToShow, transferProcessesFieldsToShow} from "@/utilities/contract-agreement";
import FieldGrid from "@/components/molecules/field-grid";
import {MarkdownCollapsableText} from "@/components/molecules/markdown-collapsable-text";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld";
import {ASSET_DESCRIPTION} from "@/schema/asset";
import Divider from "@mui/material/Divider";
import {assetGeneralFieldsToShow} from "@/utilities/asset";
import {PolicyConstraintShow} from "@/components/molecules/policy-constraint-show";
import {TransferProcess} from "@think-it-labs/edc-connector-client/dist/src/entities";

interface ContractAgreementDetailsProps {
  contractAgreement: ContractAgreement;
  participantId: string;
  managementUrl: string;
}

export default function ContractAgreementDetails({ contractAgreement, participantId, managementUrl }: ContractAgreementDetailsProps) {
  const [asset, setAsset] = useState({} as Asset);
  const [transferProcesses, setTransferProcesses] = useState<TransferProcess[]>([]);
  const description = readValue(asset.properties, ASSET_DESCRIPTION);

  const [transferProcessesFields, contractAgreementFields, assetFields] = [
    transferProcessesFieldsToShow(transferProcesses),
    contractAgreementFieldsToShow(contractAgreement, participantId),
    assetGeneralFieldsToShow(asset, participantId, ""), // TODO: connector endpoint
  ];
  const edcClient = useEdcConnectorClient({management: managementUrl});

  useEffect(() => {
    edcClient.management.assets.get(contractAgreement.assetId).then(setAsset);
  }, [edcClient, contractAgreement.assetId]);

  useEffect(() => {
    edcClient.management.transferProcesses.queryAll({
      filterExpression: [{
        "operandLeft": "contractId",
        "operator": "=",
        "operandRight": contractAgreement.id
      }]
    }).then(setTransferProcesses);
  }, [edcClient, contractAgreement.id]);

  return (
    <>
      <div className="flex flex-col gap-y-9">
        <div>
          {description ?
            <MarkdownCollapsableText data={description}/> :
            <T string="assets.new.noDescription"/>
          }
          <Divider/>
        </div>

        <FieldGrid fields={transferProcessesFields} label="transferProcesses.history"/>

        <FieldGrid fields={contractAgreementFields} label="contractAgreements.contractAgreement"/>

        <div className="flex flex-col gap-y-2.5">
          <Typography className="text-lg font-normal uppercase">
            <T string="contractAgreements.contractPolicy"/>
          </Typography>
          <PolicyConstraintShow
            constraints={removeJsonLdSchemaFromProperties(contractAgreement.policy?.permissions)}
            jsonLdObject={contractAgreement?.policy?.permissions}
            jsonLdDialogTitle={<TitleWithIcon
              icon={<Icon className="mt-1.5" fontSize="large">policy</Icon>}
              title={<div className="flex gap-x-1">
                <T string="contractDefinitions.contractOffer"/>
                <T string="contractDefinitions.contractPolicyJsonLd"/>
              </div>}
            />}
          />
        </div>

        <FieldGrid fields={assetFields} label="contractAgreements.headingAsset"/>
      </div>
    </>
  );
}
