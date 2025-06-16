import {
  ContractAgreement,
  PolicyDefinition,
  QuerySpec,
} from "@think-it-labs/edc-connector-client";
import React, {PropsWithChildren, ReactNode, useCallback} from "react";
import { AssetView } from "./asset-view";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { List } from "./list";
import { Local } from "./local";

interface ContractAgreementsListPropsBase {
  managementUrl: string;
  sections?: {
    key: string;
    title: ReactNode;
    condition: (item: ContractAgreement) => boolean;
    containerClassName?: string;
  }[];
}

interface ContractAgreementsListPropsWithoutPagination extends ContractAgreementsListPropsBase {
  usePagination: false;
}

interface ContractAgreementsListPropsWithPagination extends ContractAgreementsListPropsBase {
  usePagination: true;
  currentPage: number;
  firstPage?: number;
  navigate: (newPage: number) => void;
}

type ContractAgreementsListProps =
  | ContractAgreementsListPropsWithoutPagination
  | ContractAgreementsListPropsWithPagination;

export function ContractAgreementsList({
  children,
  managementUrl,
  ...props
}: PropsWithChildren<ContractAgreementsListProps>) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const queryAll = useCallback(
    (querySpec: QuerySpec) => {
      if (Object.keys(querySpec).length != 0) {
        return client.management.contractAgreements.queryAll(querySpec);
      }

      return Promise.resolve([new ContractAgreement()]);
    },
    [client],
  );

  if (props.usePagination) {
    return (
      <List<ContractAgreement>
        queryAll={queryAll}
        getId={(contractAgreement: ContractAgreement) => String(contractAgreement.id)}
        managementUrl={managementUrl}
        navigate={props.navigate}
        page={props.currentPage}
        usePagination={props.usePagination}
        firstPage={props.firstPage}
        sections={props.sections}
      >
        {children}
      </List>)
  }

  return (<List<ContractAgreement>
    queryAll={queryAll}
    getId={(contractAgreement: ContractAgreement) => String(contractAgreement.id)}
    managementUrl={managementUrl}
    sections={props.sections}
  >
    {children}
  </List>)

}

interface ContractAgreementsListAssetProps {
  id: string;
  managementUrl: string;
}

function ContractAgreementsListAsset(
  props: PropsWithChildren<ContractAgreementsListAssetProps>,
) {
  return <AssetView {...props} />;
}

ContractAgreementsListAsset.Id = AssetView.Id;
ContractAgreementsListAsset.Name = AssetView.Name;
ContractAgreementsListAsset.ContentType = AssetView.ContentType;
ContractAgreementsListAsset.DataAddress = AssetView.DataAddress;

ContractAgreementsList.Asset = ContractAgreementsListAsset;

ContractAgreementsList.Items = List.Items<ContractAgreement>;

ContractAgreementsList.Loading = List.Loading;

ContractAgreementsList.Search = List.Search;

ContractAgreementsList.SearchTrigger = List.SearchTrigger;

interface ContractAgreementsListContractAgreementProps {
  contractAgreement?: ContractAgreement;
}

function ContractAgreementsListContractAgreement(
  { contractAgreement, children }: PropsWithChildren<
    ContractAgreementsListContractAgreementProps
  >,
) {
  return (
    <Local
      item={contractAgreement}
    >
      {children}
    </Local>
  );
}

ContractAgreementsList.ContractAgreement =
  ContractAgreementsListContractAgreement;

interface ContractAgreementsListContractAgreementPolicyProps {
  policyDefinition?: PolicyDefinition;
}

function ContractAgreementsListContractAgreementPolicy(
  { policyDefinition, children }: PropsWithChildren<
    ContractAgreementsListContractAgreementPolicyProps
  >,
) {
  return (
    <Local
      item={policyDefinition}
    >
      {children}
    </Local>
  );
}

ContractAgreementsListContractAgreement.Policy =
  ContractAgreementsListContractAgreementPolicy;
