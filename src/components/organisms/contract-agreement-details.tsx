import React from "react";
import { T } from "@/i18n";
import {Asset, ContractAgreement} from "@think-it-labs/edc-connector-client";
import {Icon} from "@mui/material";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon";
import {removeJsonLdSchemaFromProperties} from "@/utilities/catalog";
import Typography from "@mui/material/Typography";
import {contractAgreementFieldsToShow} from "@/utilities/contract-agreement";
import FieldGrid from "@/components/molecules/field-grid";
import {MarkdownCollapsableText} from "@/components/molecules/markdown-collapsable-text";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld";
import {ASSET_DESCRIPTION} from "@/schema/asset";
import Divider from "@mui/material/Divider";
import {assetGeneralFieldsToShow} from "@/utilities/asset";
import {PolicyConstraintShow} from "@/components/molecules/policy-constraint-show";
import {TransferProcess} from "@think-it-labs/edc-connector-client/dist/src/entities";
import TransferProcessList from "@/components/molecules/transfer-process-list.tsx";

interface ContractAgreementDetailsProps {
  contractAgreement: ContractAgreement;
  participantId: string;
  asset: Asset;
  transferProcesses: TransferProcess[];
  counterPartyAddress: string;
}

export default function ContractAgreementDetails({ contractAgreement, participantId, asset, transferProcesses, counterPartyAddress }: ContractAgreementDetailsProps) {
  const description = readValue(asset.properties, ASSET_DESCRIPTION);
  const [contractAgreementFields, assetFields] = [
    contractAgreementFieldsToShow(contractAgreement, participantId, counterPartyAddress),
    assetGeneralFieldsToShow(asset, participantId, counterPartyAddress),
  ];

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

        <TransferProcessList transferProcesses={transferProcesses} />

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
