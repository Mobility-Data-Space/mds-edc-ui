
import { ContractAgreementView } from "@think-it-labs/edc-connector-ui/contract-agreement-view";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T } from "@/i18n";
import { useRouter } from "next/router";
import React from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import { List } from "@think-it-labs/edc-connector-ui/list";

export default function ContractAgreementViewPage() {
  const id = useRouter().query.id as string;
  const { connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;
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
      </ContractAgreementView>
    </SideDrawer>
  );
}
