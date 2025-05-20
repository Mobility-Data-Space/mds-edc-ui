
import { ContractAgreementView } from "@think-it-labs/edc-connector-ui/contract-agreement-view";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { useRouter } from "next/router";
import React, {useState} from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import Button from "@mui/material/Button";
import {TransferFormDialog} from "@/components/templates/transfer-form-dialog.tsx";

export default function ContractAgreementViewPage() {
  const id = useRouter().query.id as string;
  const { push, connector } = useParticipantConnectorState();
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
        <p>
          <T string="title" />
        </p>
        <p>
          <T string="description" />
        </p>
        <ul>
          <li><ContractAgreementView.Id /></li>
          <li><ContractAgreementView.AssetId /></li>
          <li><ContractAgreementView.ConsumerId /></li>
          <li><ContractAgreementView.ProviderId /></li>
          <li><ContractAgreementView.Policy /></li>
        </ul>
        <div className="flex justify-end gap-x-2">
          <Button
            data-testid="transfer-process-submit"
            variant="contained"
            onClick={() => setIsTransferModalOpen(true)}
          >
            <T string="common.transfer" />
          </Button>
        </div>
      </ContractAgreementView>
    </SideDrawer>
  );
}
