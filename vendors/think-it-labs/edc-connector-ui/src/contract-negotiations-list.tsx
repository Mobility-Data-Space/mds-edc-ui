import {
  ContractNegotiation,
  QuerySpec,
} from "@think-it-labs/edc-connector-client";
import React, { PropsWithChildren, useCallback } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { List } from "./list";
import { ListProps } from "./types";

export type ContractNegotiationsListProps = ListProps & {
  managementUrl: string;
}

export function ContractNegotiationsList({
  children,
  managementUrl,
  ...props
}: PropsWithChildren<ContractNegotiationsListProps>) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const queryAll = useCallback(
    (querySpec: QuerySpec) => {
      if (Object.keys(querySpec).length != 0) {
        return client.management.contractNegotiations.queryAll(querySpec);
      }

      return Promise.resolve([new ContractNegotiation()]);
    },
    [client],
  );

  if (props.usePagination) {
    return (
      <List<ContractNegotiation>
        queryAll={queryAll}
        getId={(contractNegotiation: ContractNegotiation) =>
          contractNegotiation.id}
        managementUrl={managementUrl}
        navigate={props.navigate}
        page={props.currentPage}
        usePagination={props.usePagination}
        firstPage={props.firstPage}
      >
        {children}
      </List>)
  }

  return (
    <List<ContractNegotiation>
      queryAll={queryAll}
      getId={(contractNegotiation: ContractNegotiation) =>
        contractNegotiation.id}
      managementUrl={managementUrl}
    >
      {children}
    </List>
  );
}

ContractNegotiationsList.Items = List.Items<ContractNegotiation>;

ContractNegotiationsList.Loading = List.Loading;

ContractNegotiationsList.Search = List.Search;

ContractNegotiationsList.SearchTrigger = List.SearchTrigger;

ContractNegotiationsList.Pagination = List.Pagination;