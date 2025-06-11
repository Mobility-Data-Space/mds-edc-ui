import {compact, ContractNegotiation} from "@think-it-labs/edc-connector-client";
import React, {useEffect, useState} from "react";
import { PropsWithChildren, useCallback } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { useViewContext, View } from "./view";

export const useContractNegotiationContext = () => {
  const { item } = useViewContext<ContractNegotiation>();
  const [compactedItem, setCompactedItem] = useState(item);
  useEffect(() => {
    compact(item).then(compacted => setCompactedItem(compacted as ContractNegotiation));
  }, [item]);

  return {
    item: compactedItem
  };
};

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

ContractNegotiationView.CreatedAt = function ContractAgreementViewCreatedAt() {
  const { item } = useContractNegotiationContext();
  return <>{item?.createdAt && (new Date(item.createdAt * 1000).toString())}</>;
};

ContractNegotiationView.CounterPartyId = function ContractAgreementViewCounterPartyId() {
  const { item } = useContractNegotiationContext();
  return <>{item?.counterPartyId}</>;
};

ContractNegotiationView.Protocol = function ContractAgreementViewProtocol() {
  const { item } = useContractNegotiationContext();
  return <>{item?.protocol}</>;
};

ContractNegotiationView.State = function ContractAgreementViewState() {
  const { item } = useContractNegotiationContext();
  return <>{item?.state}</>;
};

ContractNegotiationView.Type = function ContractAgreementViewType() {
  const { item } = useContractNegotiationContext();
  return <>{item?.type}</>;
};

ContractNegotiationView.ErrorDetail =
  function ContractAgreementViewErrorDetail() {
    const { item } = useContractNegotiationContext();
    return <>{item?.errorDetail}</>;
  };

ContractNegotiationView.Loading = View.Loading;
