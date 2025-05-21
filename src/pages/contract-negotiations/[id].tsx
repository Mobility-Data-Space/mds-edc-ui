
import {
  ContractNegotiationView,
} from "@think-it-labs/edc-connector-ui/contract-negotiation-view";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T } from "@/i18n";
import { useRouter } from "next/router";
import React from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";

export default function ContractNegotiationViewPage() {
  const id = useRouter().query.id as string;
  const { connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;
  
  return (
    <SideDrawer title={<T string="contractNegotiations.[id].title" />}>
      <ContractNegotiationView
        id={id}
        managementUrl={managementUrl}
      >
        <ul>
          <li>
            <ContractNegotiationView.Id />
          </li>
          <li>
            <ContractNegotiationView.ContractAgreementId />
          </li>
          <li>
            <ContractNegotiationView.CounterPartyAddress />
          </li>
          <li>
            <ContractNegotiationView.ErrorDetail />
          </li>
        </ul>
      </ContractNegotiationView>
    </SideDrawer>
  );
}
