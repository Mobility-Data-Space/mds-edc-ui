import { TransferProcess } from "@think-it-labs/edc-connector-client";
import React from "react";
import { PropsWithChildren, useCallback } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { useViewContext, View } from "./view";

export const useTransferProcessContext = () =>
  useViewContext<TransferProcess>();

interface TransferProcessProps {
  id: string;
  managementUrl: string;
}

export function TransferProcessView(
  { children, id, managementUrl }: PropsWithChildren<TransferProcessProps>,
) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const get = useCallback(
    () => {
      if (id != undefined)
        return client.management.transferProcesses.get(id)
      
      return Promise.resolve(new TransferProcess())
    },
    [client, id],
  );

  return (
    <View<TransferProcess>
      get={get}
      managementUrl={managementUrl}
    >
      {children}
    </View>
  );
}

TransferProcessView.Id = function TransferProcessViewId() {
  const { item } = useTransferProcessContext();
  return <>{item?.id}</>;
};

TransferProcessView.ConnectorId = function TransferProcessViewConnectorId() {
  const { item } = useTransferProcessContext();
  return <>{item?.connectorId}</>;
};

TransferProcessView.ContractId = function TransferProcessViewContractId() {
  const { item } = useTransferProcessContext();
  return <>{item?.contractId}</>;
};

TransferProcessView.AssetId = function TransferProcessViewAssetId() {
  const { item } = useTransferProcessContext();
  return <>{item?.assetId}</>;
};

TransferProcessView.CorrelationId =
  function TransferProcessViewCorrelationId() {
    const { item } = useTransferProcessContext();
    return <>{item?.correlationId}</>;
  };

TransferProcessView.Loading = View.Loading;
