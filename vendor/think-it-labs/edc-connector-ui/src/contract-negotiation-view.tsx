import { ContractNegotiation } from "@think-it-labs/edc-connector-client";
import React from "react";
import { PropsWithChildren, useCallback } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { useViewContext, View } from "./view";

export const useContractNegotiationContext = () =>
  useViewContext<ContractNegotiation>();

interface ContractNegotiationProps {
  id: string;
  managementUrl: string;
}

export function ContractNegotiationView(
  { children, id, managementUrl }: PropsWithChildren<ContractNegotiationProps>,
) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const get = useCallback(
    () => {
      if (id != undefined)
        return client.management.contractNegotiations.get(id)
      
      return Promise.resolve(new ContractNegotiation())
    },
    [client, id],
  );

  return (
    <View<ContractNegotiation>
      get={get}
      managementUrl={managementUrl}
    >
      {children}
    </View>
  );
}

ContractNegotiationView.Id = function ContractNegotiationViewId() {
  const { item } = useContractNegotiationContext();
  return <>{item?.id}</>;
};

ContractNegotiationView.ContractAgreementId =
  function ContractAgreementViewContractAgreementId() {
    const { item } = useContractNegotiationContext();
    return <>{item?.contractAgreementId}</>;
  };

ContractNegotiationView.CounterPartyAddress =
  function ContractAgreementViewCounterPartyAddress() {
    const { item } = useContractNegotiationContext();
    return <>{item?.counterPartyAddress || "n.a."}</>;
  };

ContractNegotiationView.CreatedAt = function ContractAgreementViewProviderId() {
  const { item } = useContractNegotiationContext();
  return <>{item?.createdAt}</>;
};

ContractNegotiationView.ErrorDetail =
  function ContractAgreementViewErrorDetail() {
    const { item } = useContractNegotiationContext();
    return <>{item?.errorDetail}</>;
  };

ContractNegotiationView.Loading = View.Loading;
