import {
  Edr,
  QuerySpec
} from "@think-it-labs/edc-connector-client";
import React, { PropsWithChildren, useCallback } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { List } from "./list";
import { Local } from "./local";
import { ListProps } from "./types";

type EdrsListProps = ListProps & {
  managementUrl: string;
};

export function EdrsList({
  children,
  managementUrl,
  ...props
}: PropsWithChildren<EdrsListProps>) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const queryAll = useCallback(
    (querySpec: QuerySpec) => {
      if (Object.keys(querySpec).length != 0) {
        return client.management.edrs.request(querySpec);
      }

      return Promise.resolve([new Edr()]);
    },
    [client],
  );

  if (props.usePagination) {
    return (
      <List<Edr>
        queryAll={queryAll}
        getId={(edr: Edr) => String(edr.id)}
        managementUrl={managementUrl}
        navigate={props.navigate}
        page={props.currentPage}
        usePagination={props.usePagination}
        firstPage={props.firstPage}
      >
        {children}
      </List>
    );
  }

  return (
    <List<Edr>
      queryAll={queryAll}
      getId={(edr: Edr) => String(edr.id)}
      managementUrl={managementUrl}
    >
      {children}
    </List>
  );
}

// interface EdrsListAssetProps {
//   id: string;
//   managementUrl: string;
// }
//
// function EdrsListAsset(
//   props: PropsWithChildren<EdrsListAssetProps>,
// ) {
//   return <AssetView {...props} />;
// }

// EdrsListAsset.Id = AssetView.Id;
// EdrsListAsset.Name = AssetView.Name;
// EdrsListAsset.ContentType = AssetView.ContentType;
// EdrsListAsset.DataAddress = AssetView.DataAddress;

// ContractAgreementsList.Asset = EdrsListAsset;

EdrsList.Items = List.Items<Edr>;

EdrsList.Loading = List.Loading;

EdrsList.Search = List.Search;

EdrsList.SearchTrigger = List.SearchTrigger;

EdrsList.Pagination = List.Pagination;

interface EdrsListEdrProps {
  edr?: Edr;
}

function EdrsListEdr({ edr, children }: PropsWithChildren<EdrsListEdrProps>) {
  return <Local item={edr}>{children}</Local>;
}

EdrsList.Edr = EdrsListEdr;

EdrsList.Error = List.Error;
