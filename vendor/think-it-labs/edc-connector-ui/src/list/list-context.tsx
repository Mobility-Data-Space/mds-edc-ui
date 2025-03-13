import { QuerySpec } from "@think-it-labs/edc-connector-client";
import { Context, createContext, useContext } from "react";

export type ListContext<T> = Context<ListContextType<T>>;

export type ListContextType<T> = {
  items: T[];
  isLoading: boolean;
  setQuerySpec: (querySpec: QuerySpec) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  triggerSearch: () => void;
  deleteItem: (itemId: string) => void;
  getId: (item: T) => string;
  managementUrl: string;
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
