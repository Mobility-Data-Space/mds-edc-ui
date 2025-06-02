import { Context, createContext, useContext } from "react";

export type LocalContext<T> = Context<LocalContextType<T>>;

type LocalContextType<T> = {
  item: T | null;
  deleteItem: () => Promise<void>;
};

function createLocalContext<T>(): LocalContext<T> {
  return createContext<LocalContextType<T> | null>(null) as any;
}

export const LocalContext = createLocalContext();

export function useLocalContext<T>(): LocalContextType<T> {
  const context = useContext(LocalContext) as LocalContextType<T>;

  if (!context) {
    throw new Error("Components must be used within a <List/>");
  }

  return context;
}
