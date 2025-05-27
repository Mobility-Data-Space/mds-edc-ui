import React, {useMemo, useState, useEffect} from "react";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import { T } from "@/i18n";
import {Asset, ContractAgreement} from "@think-it-labs/edc-connector-client";
import {Icon} from "@mui/material";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon.tsx";
import {removeJsonLdSchemaFromProperties} from "@/utilities/catalog.ts";
import Typography from "@mui/material/Typography";
import {contractAgreementFieldsToShow, transferProcessesFieldsToShow} from "@/utilities/contract-agreement.ts";
import FieldGrid from "@/components/molecules/field-grid.tsx";
import {MarkdownCollapsableText} from "@/components/molecules/markdown-collapsable-text.tsx";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import {ASSET_DESCRIPTION} from "@/schema/asset.ts";
import Divider from "@mui/material/Divider";
import {assetGeneralFieldsToShow} from "@/utilities/asset.ts";
import {PolicyConstraintShow} from "@/components/molecules/policy-constraint-show.tsx";
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
  }, [contractAgreement.assetId])

  useEffect(() => {
    edcClient.management.transferProcesses.queryAll({
      filterExpression: [{
        "operandLeft": "contractId",
        "operator": "=",
        "operandRight": contractAgreement.id
      }]
    }).then(setTransferProcesses);
  }, [contractAgreement.id])

  console.log("transferProcesses : ", transferProcesses)
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
