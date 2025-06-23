import { QuerySpec } from "@think-it-labs/edc-connector-client";
import { useCallback, useEffect, useState } from "react";
import { SearchSpec } from "../types";

interface ListHook<T> {
  items: T[];
  error: Error | null;
  isLoading: boolean;
  setQuerySpec: (querySpec: QuerySpec) => void;
  searchSpec: SearchSpec;
  setSearchSpec: (searchSpec: Partial<SearchSpec>) => void;
  triggerSearch: () => void;
  deleteItem: (id: string) => void;
}

interface UseListOptions<T> {
  queryAll: (querySpec: QuerySpec) => Promise<T[]>;
  delete: (id: string) => Promise<void>;
}

export function useList<T>(
  { queryAll, delete: del }: UseListOptions<T>,
): ListHook<T> {
  const [querySpec, setQuerySpec] = useState<QuerySpec>({});
  const [searchSpec, setSearchSpec] = useState<SearchSpec>({
    operandLeft: "edc:name",
    operator: "=",
    operandRight: "",
  });
  const [items, setItems] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);

  const deleteItem = useCallback(
    (id: string) => del(id),
    [
      del,
    ],
  );

  useEffect(() => {
    (
      async function () {
        try {
          setLoading(true);
          const response = await queryAll(querySpec);
          setItems(response);
        } catch (err) {
          setItems([]);
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      }
    )();
  }, [queryAll, querySpec]);

  useEffect(() => {
    (
      async function () {
        if (!shouldSearch) {
          return;
        }

        try {
          setLoading(true);

          const response = await queryAll(querySpec);
          setItems(response);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
          setShouldSearch(false);
        }
      }
    )();
  }, [queryAll, querySpec, shouldSearch]);

  const _setSearchSpec = useCallback((searchSpec: Partial<SearchSpec>) => {
    setSearchSpec((state) => ({ ...state, ...searchSpec }))
  }, [])

  const triggerSearch = useCallback(() => {
    const shouldWrap = searchSpec.operandRight && searchSpec.operator === "ilike" || searchSpec.operator === "like";
    const operandRight = shouldWrap
      ? `%${searchSpec.operandRight}%`
      : searchSpec.operandRight;

    setQuerySpec({
      ...querySpec,
      filterExpression: searchSpec.operandRight
        ? [{ ...searchSpec, operandRight }]
        : [],
    });

    setShouldSearch(true);
  }, [searchSpec, querySpec])

  return {
    items,
    error,
    isLoading,
    setQuerySpec,
    searchSpec,
    setSearchSpec: _setSearchSpec,
    deleteItem,
    triggerSearch,
  };
}
