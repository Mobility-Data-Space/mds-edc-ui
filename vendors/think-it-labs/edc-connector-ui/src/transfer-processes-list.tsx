import {
  ContractAgreement,
  QuerySpec,
  TransferProcess,
} from "@think-it-labs/edc-connector-client";
import React, { PropsWithChildren, useCallback } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { List } from "./list";
import { Local } from "./local";

interface TransferProcessesListProps {
  managementUrl: string;
}

export function TransferProcessesList({
  children,
  managementUrl,
}: PropsWithChildren<TransferProcessesListProps>) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const queryAll = useCallback(
    (querySpec: QuerySpec) => {
      if (Object.keys(querySpec).length != 0) {
        return client.management.transferProcesses.queryAll(querySpec);
      }

      return Promise.resolve([new TransferProcess()]) ;
    },
    [client],
  );

  return (
    <List<TransferProcess>
      queryAll={queryAll}
      getId={(policyDefinition: TransferProcess) => policyDefinition.id}
      managementUrl={managementUrl}
    >
      {children}
    </List>
  );
}

TransferProcessesList.Items = List.Items<TransferProcess>;

TransferProcessesList.Loading = List.Loading;

TransferProcessesList.Search = List.Search;

TransferProcessesList.SearchTrigger = List.SearchTrigger;

interface TransferProcessesListContractProps {
  contract?: ContractAgreement;
}

function TransferProcessesListContract(
  { contract, children }: PropsWithChildren<
    TransferProcessesListContractProps
  >,
) {
  return (
    <Local
      item={contract}
    >
      {children}
    </Local>
  );
}

TransferProcessesList.Contract = TransferProcessesListContract;
