import {Asset, Catalog as CatalogResult, CriterionInput, QuerySpec} from "@think-it-labs/edc-connector-client";
import React, {PropsWithChildren, useCallback, useEffect, useMemo} from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import {List, useListContext} from "./list";
import { Local } from "./local";
import {CATALOG_DATASET, PARTICIPANT_ID} from "../../../../src/schema/catalog"; // TODO: should not import from outside the package

export interface CatalogListItemProps<T> {
  item: T; // fix: type this
  deleteItem: () => void;
  index: number;
  participantId?: string;
}

export interface CatalogListItemsProps<T> {
  limit?: number;
  offset?: number;
  filterExpression?: CriterionInput[];
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
  children: (props: CatalogListItemProps<T>) => JSX.Element;
}

interface CatalogProps {
  managementUrl: string;
  protocolUrl: string;
}

export function Catalog({
  children,
  managementUrl,
  protocolUrl,
}: PropsWithChildren<CatalogProps>) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const queryAll = useCallback(
    (querySpec: QuerySpec) => client.management.catalog.request({
      counterPartyAddress: protocolUrl,
      querySpec,
    }),
    [client],
  );

  const del = useCallback(
    (id: string) => client.management.assets.delete(id),
    [client],
  );

  return (
    <List<CatalogResult>
      queryAll={queryAll as any} // TODO: type
      delete={del}
      getId={(asset) => asset.id}
      managementUrl={managementUrl}
    >
      {children}
    </List>
  );
}

Catalog.Items = function ListItems({ children, limit, offset, filterExpression, sortField, sortOrder, }: CatalogListItemsProps<CatalogResult>) {
  const {
    items,
    setQuerySpec,
    isLoading,
    deleteItem,
    getId,
  } = useListContext<CatalogResult>();

  useEffect(() => {
    setQuerySpec({
      limit,
      offset,
      filterExpression,
      sortField,
      sortOrder,
    });
  }, [limit, offset, setQuerySpec, filterExpression, sortField, sortOrder]);


  const Item = useMemo(() => {
    return function Item(props: CatalogListItemProps<CatalogResult>) {
      return <>{children(props)}</>;
    };
  }, [children]);

  const participantIdJsonLD = items[PARTICIPANT_ID as any];
  const participantId = (participantIdJsonLD && participantIdJsonLD[0] && participantIdJsonLD[0]["@value"]) || "";
  return (
    <>
      {/* TODO: remove type any */}
      {!isLoading && items[CATALOG_DATASET as any] && items[CATALOG_DATASET as any]?.map((item: any, index: number) => (
        <Item
          key={getId(item)}
          item={item}
          deleteItem={() => deleteItem(getId(item))}
          index={index}
          participantId={participantId}
        />
      ))}
    </>
  );
};

Catalog.Loading = List.Loading;

Catalog.Search = List.Search;

Catalog.SearchTrigger = List.SearchTrigger;

interface AssetsListAssetProps {
  asset?: Asset;
}

function CatalogDataSet(
  { asset, children }: PropsWithChildren<AssetsListAssetProps>,
) {
  const { managementUrl } = useListContext();
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  return (
    <Local
      item={asset}
      delete={async () => {
        if (asset?.id) {
          await client.management.assets.delete(asset?.id);
        }
      }}
    >
      {children}
    </Local>
  );
}

Catalog.DataSet = CatalogDataSet;
