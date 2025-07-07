import { CriterionInput, QuerySpec } from "@think-it-labs/edc-connector-client";
import React, { PropsWithChildren, ReactNode, useEffect, useMemo } from "react";
import { usePagination } from "../hooks/use-pagination";
import { SearchSpec } from "../types";
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
    searchSpec,
    setSearchSpec,
    triggerSearch,
    deleteItem,
    error,
  } = useList<T>({
    delete: del,
    queryAll,
  });

  const pagination = usePagination({ navigate: navigate || function () { }, page: page || 0, firstPage })

  return (
    <ListContext.Provider
      value={{
        isLoading,
        error,
        items,
        setQuerySpec,
        searchSpec,
        setSearchSpec,
        deleteItem: (id: string) => deleteItem(id),
        setSearchQuery: setSearchSpec,
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
  limit: clientLimit,
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

  let limit = clientLimit

  useEffect(() => {
    if (clientLimit) {
      pagination?.setMaxItems(clientLimit);
    }
  }, [clientLimit, pagination?.setMaxItems]);

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

  // Global refetch event listener
  useEffect(() => {
    function handleRefetch() {
      setQuerySpec({
        limit,
        offset,
        filterExpression,
        sortField,
        sortOrder,
      });
    }
    window.addEventListener("list-refetch", handleRefetch);
    return () => {
      window.removeEventListener("list-refetch", handleRefetch);
    };
  }, [limit, offset, filterExpression, sortField, sortOrder, setQuerySpec]);

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
              deleteItem={async () => {
                await deleteItem(getId(item));
                setQuerySpec({
                  limit,
                  offset,
                  filterExpression,
                  sortField,
                  sortOrder,
                });
              }}
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
          deleteItem={async () => {
            await deleteItem(getId(item));
            setQuerySpec({
              limit,
              offset,
              filterExpression,
              sortField,
              sortOrder,
            });
          }}
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
  searchTarget?: string
  searchOperation?: SearchSpec["operator"]
}

List.Search = function ListSearch(
  { placeholder, name, className, searchTarget, searchOperation }: ListSearchProps,
) {
  const { searchSpec, setSearchSpec, triggerSearch } = useListContext();

  useEffect(() => {
    setSearchSpec({ operator: searchOperation, operandLeft: searchTarget })
  }, [searchTarget, searchOperation])

  return (
    <input
      type="text"
      name={name}
      className={className}
      placeholder={placeholder}
      value={searchSpec.operandRight}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          triggerSearch();
        }
      }}
      onChange={(event) => setSearchSpec({ operandRight: event.currentTarget.value })}
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
  itemsCount: number
  hasNext: boolean
  hasPrev: boolean
  decrementPage: () => void
  incrementPage: () => void
}

List.Pagination = function Pagination({
  children,
}: PaginationProps) {
  const { pagination, items } = useListContext()

  if (!pagination) {
    throw Error("Need to use usePagination=true on provider")
  }

  let itemsCount = Math.min(items.length, pagination.maxItems)

  const PaginationControls = useMemo(() => {
    return function PaginationControls(props: PaginationControlsProps) {
      return <>{children(props)}</>;
    };
  }, [children]);

  return <PaginationControls
    page={pagination.page}
    itemsCount={itemsCount}
    hasNext={pagination.hasNext}
    hasPrev={pagination.hasPrev}
    decrementPage={pagination.decrementPage}
    incrementPage={pagination.incrementPage}
  />
}

List.Error = function ListError({ children }: {
  children: (props: { error: Error | null }) => JSX.Element;
}) {
  const { error } = useListContext()

  const ErrorComponent = useMemo(() => {
    return function (props: { error: Error | null }) {
      return <>{children(props)}</>;
    };
  }, [children]);

  return <ErrorComponent error={error} />
}
