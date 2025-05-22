import React, { PropsWithChildren } from "react";
import { useView } from "./use-view";
import { useViewContext, ViewContext } from "./view-context";

interface ViewProps<T> {
  get: () => Promise<T>;
  delete?: () => Promise<void>;
  managementUrl: string;
}

export function View<T>({
  children,
  get,
  delete: del = async () => {
    console.warn("delete method not defined");
  },
  managementUrl,
}: PropsWithChildren<ViewProps<T>>) {
  const { item, deleteAsset, isLoading } = useView({
    get,
    delete: del,
  });

  return (
    <ViewContext.Provider
      value={{
        item,
        isLoading,
        deleteItem: deleteAsset,
        managementUrl,
      }}
    >
      {children}
    </ViewContext.Provider>
  );
}

View.Loading = function ViewLoading(
  { children = <div>Loading...</div> }: PropsWithChildren,
) {
  const { isLoading } = useViewContext();
  return isLoading ? children : null;
};
