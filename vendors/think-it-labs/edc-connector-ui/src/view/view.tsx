import React, { PropsWithChildren } from "react";
import { useView } from "./use-view";
import { useViewContext, ViewContext } from "./view-context";

interface ViewProps<T> {
  get: () => Promise<T>;
  delete?: () => Promise<void>;
  managementUrl: string;
  cacheKey?: string;
}

export function View<T>({
  children,
  get,
  cacheKey,
  delete: del = async () => {
    console.warn("delete method not defined");
  },
  managementUrl,
}: PropsWithChildren<ViewProps<T>>) {
  const { item, deleteAsset, isLoading, error } = useView({
    get,
    cacheKey,
    delete: del,
  });

  return (
    <ViewContext.Provider
      value={{
        item,
        error,
        isLoading,
        deleteItem: deleteAsset,
        managementUrl,
      }}
    >
      {children}
    </ViewContext.Provider>
  );
}

interface ViewLoadingProps {
  fallback?: JSX.Element;
}

View.Loading = function ViewLoading({
  fallback = <div>Loading...</div>,
  children,
}: PropsWithChildren<ViewLoadingProps>) {
  const { isLoading } = useViewContext();
  return isLoading ? fallback : children;
};

View.Error = function ViewError({
  children,
}: {
  children: (props: { error: Error | null }) => JSX.Element;
}) {
  const { error } = useViewContext();

  const ErrorComponent = React.useMemo(() => {
    return function (props: { error: Error | null }) {
      return <>{children(props)}</>;
    };
  }, [children]);

  return <ErrorComponent error={error} />;
};
