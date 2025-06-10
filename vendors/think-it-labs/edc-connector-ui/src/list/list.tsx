import { CriterionInput, QuerySpec } from "@think-it-labs/edc-connector-client";
import React, { PropsWithChildren, useEffect, useMemo } from "react";
import { ListContext, useListContext } from "./list-context";
import { useList } from "./use-list";

export interface ListProps<T> {
  queryAll: (querySpec: QuerySpec) => Promise<T[]>;
  delete?: (id: string) => Promise<void>;
  getId: (item: T) => string;
  managementUrl: string;
}

export function List<T>({
  children,
  queryAll,
  delete: del = async () => {
    console.warn("delete method not defineds");
  },
  getId,
  managementUrl,
}: PropsWithChildren<ListProps<T>>) {
  const {
    items,
    setQuerySpec,
    isLoading,
    searchQuery,
    setSearchQuery,
    triggerSearch,
    deleteItem,
  } = useList<T>({
    delete: del,
    queryAll,
  });

  return (
    <ListContext.Provider
      value={{
        isLoading,
        items,
        setQuerySpec,
        searchQuery,
        deleteItem: (id: string) => deleteItem(id),
        setSearchQuery: (value: string) => setSearchQuery(value),
        triggerSearch: () => triggerSearch(),
        getId,
        managementUrl,
      } as any}
    >
      {children}
    </ListContext.Provider>
  );
}

export interface ListItemProps<T> {
  item: T; // fix: type this
  deleteItem: () => Promise<void>;
  index: number;
  items: T[]
}

export interface ListItemsProps<T> {
  limit?: number;
  offset?: number;
  filterExpression?: CriterionInput[];
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
  children: (props: ListItemProps<T>) => JSX.Element;
}

List.Items = function ListItems<T,>({
  children,
  limit,
  offset,
  filterExpression,
  sortField,
  sortOrder,
}: ListItemsProps<T>) {
  const {
    items,
    setQuerySpec,
    isLoading,
    deleteItem,
    getId,
  } = useListContext<T>();

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
    return function Item(props: ListItemProps<T>) {
      return <>{children(props)}</>;
    };
  }, [children]);

  return (
    <>
      {!isLoading && items.map((item, index, allItems) => (
        <Item
          key={getId(item)}
          item={item}
          deleteItem={async () => deleteItem(getId(item))}
          index={index}
          items={allItems}
        />
      ))}
    </>
  );
};

export interface ListLoadingProps { }

List.Loading = function ListLoading(
  { children = <div>Loading...</div> }: PropsWithChildren<
    ListLoadingProps
  >,
) {
  const { isLoading } = useListContext();
  return isLoading ? children : null;
};

export interface ListSearchProps {
  placeholder?: string;
  name?: string;
  className?: string;
}

List.Search = function ListSearch(
  { placeholder, name, className }: ListSearchProps,
) {
  const { searchQuery, setSearchQuery, triggerSearch } = useListContext();

  return (
    <input
      type="text"
      name={name}
      className={className}
      placeholder={placeholder}
      value={searchQuery}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          triggerSearch();
        }
      }}
      onChange={(event) => setSearchQuery(event.currentTarget.value)}
    />
  );
};

export interface ListSearchTriggerProps {
  className?: string;
}

List.SearchTrigger = function ListSearchTrigger(
  { className, children = "Search" }: PropsWithChildren<
    ListSearchTriggerProps
  >,
) {
  const { triggerSearch } = useListContext();

  return (
    <button
      type="button"
      className={className}
      onClick={() => triggerSearch()}
    >
      {children}
    </button>
  );
};
