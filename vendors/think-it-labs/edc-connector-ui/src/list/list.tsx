import { CriterionInput, QuerySpec } from "@think-it-labs/edc-connector-client";
import React, { PropsWithChildren, ReactNode, useEffect, useMemo } from "react";
import { usePagination } from "../hooks/use-pagination";
import { ListContext, useListContext } from "./list-context";
import { useList } from "./use-list";

type ListProps<T> = {
  queryAll: (querySpec: QuerySpec) => Promise<T[]>;
  delete?: (id: string) => Promise<void>;
  getId: (item: T) => string;
  managementUrl: string;
  usePagination?: boolean
  page?: number
  navigate?: (newPage: number) => void
  firstPage?: number,
  sections?: {
    key: string;
    title: ReactNode;
    condition: (item: T) => boolean;
    containerClassName?: string;
  }[]
}

export interface ListProviderProps {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  incrementPage: () => void;
  decrementPage: () => void;
}

export function List<T>({
  children,
  queryAll,
  delete: del = async () => {
    console.warn("delete method not defined");
  },
  getId,
  managementUrl,
  usePagination: _usePagination = false,
  page,
  navigate,
  firstPage,
  sections,
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

  const pagination = usePagination({ navigate: navigate || function () { }, page: page || 0, firstPage })

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
        pagination: _usePagination ? pagination : null,
        sections
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
  let {
    items,
    setQuerySpec,
    isLoading,
    deleteItem,
    getId,
    pagination,
    sections
  } = useListContext<T>();

  if (pagination && limit) {
    offset = pagination.page * limit;

    const hasNextPage = items.length > limit;
    pagination.setHasNext(hasNextPage);

    if (hasNextPage) {
      items = items.slice(0, limit);
    }

    limit++
  }


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

  if (!isLoading && sections && sections.length) {
    const result: ReactNode[] = [];
    sections.forEach(section => {
      result.push(<div key={section.key} >
        {section.title}
        <div className={section.containerClassName || ""}>
          {items.filter(section.condition).map((item, index) => (
            <Item
              key={getId(item)}
              item={item}
              deleteItem={async () => deleteItem(getId(item))}
              index={index}
            />
          ))}
        </div>
      </div>);
    });

    return result;
  }

  return (
    <>
      {!isLoading && items.map((item, index) => (
        <Item
          key={getId(item)}
          item={item}
          deleteItem={async () => deleteItem(getId(item))}
          index={index}
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

export interface PaginationProps {
  children: (props: PaginationControlsProps) => JSX.Element;
}

export interface PaginationControlsProps {
  page: number
  hasNext: boolean
  hasPrev: boolean
  decrementPage: () => void
  incrementPage: () => void
}

List.Pagination = function Pagination({
  children,
}: PaginationProps) {
  const { pagination } = useListContext()

  if (!pagination) {
    throw Error("Need to use usePagination=true on provider")
  }

  const PaginationControls = useMemo(() => {
    return function PaginationControls(props: PaginationControlsProps) {
      return <>{children(props)}</>;
    };
  }, [children]);

  return <PaginationControls
    page={pagination.page}
    hasNext={pagination.hasNext}
    hasPrev={pagination.hasPrev}
    decrementPage={pagination.decrementPage}
    incrementPage={pagination.incrementPage}
  />
}
