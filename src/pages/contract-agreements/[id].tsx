
import { ContractAgreementView } from "@think-it-labs/edc-connector-ui/contract-agreement-view";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { useRouter } from "next/router";
import React, {useState} from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import Button from "@mui/material/Button";
import {TransferFormDialog} from "@/components/templates/transfer-form-dialog.tsx";
import {Constraint} from "@think-it-labs/edc-connector-client";
import {ConstraintShow} from "@/components/molecules/constraint-show.tsx";
import {convertOdrlToJsonHtml, removeJsonLdSchemaFromProperties} from "@/utilities/catalog.ts";

export default function ContractAgreementViewPage() {
  const id = useRouter().query.id as string;
  const { connector } = useParticipantConnectorState();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const { translator } = useTranslator();
  const managementUrl = connector?.managementUrl as string;

  return (
    <SideDrawer title={<T string="contractAgreements.[id].title" />}>
      <ContractAgreementView
        id={id}
        managementUrl={managementUrl}
      >
        <TransferFormDialog
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          translator={translator}
        />

        <ul>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractAgreements.[id].fieldId"/></span>: <ContractAgreementView.Id/>
          </li>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractAgreements.[id].fieldAssetId"/></span>: <ContractAgreementView.AssetId/>
          </li>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractAgreements.[id].fieldConsumerId"/></span>: <ContractAgreementView.ConsumerId/>
          </li>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractAgreements.[id].fieldProviderId"/></span>: <ContractAgreementView.ProviderId/>
          </li>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractAgreements.[id].fieldContractSigningDate"/></span>: <ContractAgreementView.ContractSigningDate/>
          </li>
          <li className="mt-2">
            <div className="flex gap-x-5">

            <span className="font-bold"><T string="contractAgreements.[id].fieldPolicy"/></span>:
            <ContractAgreementView.PolicyPermissions>
              {({ item }) => <ConstraintShow
                data={convertOdrlToJsonHtml(removeJsonLdSchemaFromProperties(item), ",")}
              />}
            </ContractAgreementView.PolicyPermissions>
            </div>
          </li>
        </ul>

        <div className="flex justify-end gap-x-2">
          <Button
            data-testid="transfer-process-submit"
            variant="contained"
            onClick={() => setIsTransferModalOpen(true)}
          >
            <T string="common.transfer"/>
          </Button>
        </div>
      </ContractAgreementView>
    </SideDrawer>
  );
}
