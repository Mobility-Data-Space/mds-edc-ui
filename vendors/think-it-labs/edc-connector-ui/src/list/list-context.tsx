import { QuerySpec } from "@think-it-labs/edc-connector-client";
import { Context, createContext, ReactNode, useContext } from "react";
import { usePagination } from "../hooks/use-pagination";
import { SearchSpec } from "../types";

export type ListContext<T> = Context<ListContextType<T>>;

export type ListContextType<T> = {
  items: T[];
  isLoading: boolean;
  errors: Error[] | null
  setQuerySpec: (querySpec: QuerySpec) => void;
  searchSpec: SearchSpec;
  setSearchSpec: (searchSpec: Partial<SearchSpec>) => void;
  triggerSearch: () => void;
  deleteItem: (itemId: string) => void;
  getId: (item: T) => string;
  managementUrl: string;
  pagination?: ReturnType<typeof usePagination>;
  sections?: {
    key: string;
    title: ReactNode;
    condition: (item: T) => boolean;
    containerClassName?: string;
  }[];
};

function createListContext<T>(): ListContext<T> {
  return createContext<ListContextType<T> | null>(null) as any;
}

export const ListContext = createListContext();

export function useListContext<T>(): ListContextType<T> {
  const context = useContext(ListContext) as ListContextType<T>;

  if (!context) {
    throw new Error("Components must be used within a <List/>");
  }

  return context;
}

