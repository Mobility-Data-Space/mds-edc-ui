
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
        <ul className="marker:text-blue-600 list-disc ps-5 space-y-2 text-sm text-gray-600">
          <li>
            <T string="fieldId" />: <ContractNegotiationView.Id />
          </li>
          <li>
            <T string="fieldContractAgreementId" />:{" "}
            <ContractNegotiationView.ContractAgreementId />
          </li>
          <li>
            <T string="fieldCounterPartyAddress" />:{" "}
            <ContractNegotiationView.CounterPartyAddress />
          </li>
          <li>
            <T string="fieldErrorDetail" />:{" "}
            <ContractNegotiationView.ErrorDetail />
          </li>
        </ul>
      </ContractNegotiationView>
    </SideDrawer>
  );
}
