
import { ContractAgreementView } from "@think-it-labs/edc-connector-ui/contract-agreement-view";
import { useEdcClient, useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import Button from "@mui/material/Button";
import { ContractAgreement, PolicyBuilder } from "@think-it-labs/edc-connector-client";
import { createTransferProcessRequest } from "@/utilities/transfer_process";
import { enqueueSnackbar } from "notistack";

export default function ContractAgreementViewPage() {
  const id = useRouter().query.id as string;
  const { push, connector } = useParticipantConnectorState();

  const { translator } = useTranslator();
  const managementUrl = connector?.managementUrl as string;
  const edcClient = useEdcClient() ;

  const onSubmit = () => {
    const agreement: ContractAgreement = {
      policy: new PolicyBuilder().type("Set").build(),
      assetId: "",
      providerId: "",
      consumerId: ""
    } ;
    const transfer = createTransferProcessRequest(agreement) ;
    edcClient.management.transferProcesses.initiate(transfer)
      .catch(error => enqueueSnackbar(translator("common.errorOccurred")))
  }

  return (
    <SideDrawer title={<T string="contractAgreements.[id].title" />}>
      <ContractAgreementView
        id={id}
        managementUrl={managementUrl}
      >
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
            onClick={onSubmit}
          >
            Transfer
          </Button>
        </div>
      </ContractAgreementView>
    </SideDrawer>
  );
}
