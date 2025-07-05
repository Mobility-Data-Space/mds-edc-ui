import {
  ContractDefinition,
  QuerySpec,
} from "@think-it-labs/edc-connector-client";
import React, { PropsWithChildren, useCallback } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { List, useListContext } from "./list";
import { Local } from "./local";
import { PolicyDefinitionView } from "./policy-definition-view";
import { ListProps } from "./types";

export type ContractDefinitionsListProps = ListProps & {
  managementUrl: string;
}

export function ContractDefinitionsList({
  children,
  managementUrl,
  ...props
}: PropsWithChildren<ContractDefinitionsListProps>) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const queryAll = useCallback(
    (querySpec: QuerySpec) => {
      if (Object.keys(querySpec).length != 0) {
        return client.management.contractDefinitions.queryAll(querySpec);
      }

      return Promise.resolve([new ContractDefinition()]);
    },
    [client],
  );

  const del = useCallback(
    (id: string) => client.management.contractDefinitions.delete(id),
    [client],
  );

  if (props.usePagination) {
    return (
      <List<ContractDefinition>
        queryAll={queryAll}
        delete={del}
        getId={(contractDefinition: ContractDefinition) => String(contractDefinition.id)}
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
    <List<ContractDefinition>
      queryAll={queryAll}
      delete={del}
      getId={(contractDefinition: ContractDefinition) => String(contractDefinition.id)}
      managementUrl={managementUrl}
    >
      {children}
    </List>
  );
}

interface ContractDefinitionsListPolicyProps {
  id: string;
  managementUrl: string;
}

function ContractDefinitionsListPolicy(
  props: PropsWithChildren<ContractDefinitionsListPolicyProps>,
) {
  return <PolicyDefinitionView {...props} />;
}

ContractDefinitionsListPolicy.Id = PolicyDefinitionView.Id;

ContractDefinitionsListPolicy.CreatedAt = PolicyDefinitionView.CreatedAt;

ContractDefinitionsList.Policy = ContractDefinitionsListPolicy;

ContractDefinitionsList.Items = List.Items<ContractDefinition>;

ContractDefinitionsList.Loading = List.Loading;

ContractDefinitionsList.Search = List.Search;

ContractDefinitionsList.SearchTrigger = List.SearchTrigger;

ContractDefinitionsList.Pagination = List.Pagination;

interface ContractDefinitionsListContractDefinitionProps {
  contractDefinition?: ContractDefinition;
}

function ContractDefinitionsListContractDefinition(
  { contractDefinition, children }: PropsWithChildren<
    ContractDefinitionsListContractDefinitionProps
  >,
) {
  const { managementUrl } = useListContext();
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  return (
    <Local
      item={contractDefinition}
      delete={async () => {
        if (contractDefinition?.id) {
          await client.management.contractDefinitions.delete(
            contractDefinition?.id,
          );
        }
      }}
    >
      {children}
    </Local>
  );
}

ContractDefinitionsList.ContractDefinition =
  ContractDefinitionsListContractDefinition;
