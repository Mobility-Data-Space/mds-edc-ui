import { Context, createContext, useContext } from "react";

export type ViewContext<T> = Context<ViewContextType<T>>;

type ViewContextType<T> = {
  item: T | null;
  isLoading: boolean;
  deleteItem: () => Promise<void>;
  managementUrl: string;
  error: Error | null
};

function createViewContext<T>(): ViewContext<T> {
  return createContext<ViewContextType<T> | null>(null) as any;
}

export const ViewContext = createViewContext();

export function useViewContext<T>(): ViewContextType<T> {
  const context = useContext(ViewContext) as ViewContextType<T>;

  if (!context) {
    throw new Error("Components must be used within a <List/>");
  }

  return context;
}
