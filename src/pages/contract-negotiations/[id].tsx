import { useRouter } from "next/router";
import React from "react";
import { ContractNegotiationView } from "@think-it-labs/edc-connector-ui/contract-negotiation-view";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T } from "@/i18n";
import SideDrawer from "@/components/organisms/side-drawer";

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
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractNegotiations.[id].fieldId"/></span>: <ContractNegotiationView.Id/>
          </li>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractNegotiations.[id].fieldContractAgreementId"/></span>: <ContractNegotiationView.ContractAgreementId/>
          </li>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractNegotiations.[id].fieldCounterPartyAddress"/></span>: <ContractNegotiationView.CounterPartyAddress/>
          </li>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractNegotiations.[id].fieldCreatedAt"/></span>: <ContractNegotiationView.CreatedAt/>
          </li>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractNegotiations.[id].fieldCounterPartyId"/></span>: <ContractNegotiationView.CounterPartyId/>
          </li>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractNegotiations.[id].fieldProtocol"/></span>: <ContractNegotiationView.Protocol/>
          </li>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractNegotiations.[id].fieldState"/></span>: <ContractNegotiationView.State/>
          </li>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractNegotiations.[id].fieldType"/></span>: <ContractNegotiationView.Type/>
          </li>
        </ul>
      </ContractNegotiationView>
    </SideDrawer>
  );
}
