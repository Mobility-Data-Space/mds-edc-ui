import { QuerySpec } from "@think-it-labs/edc-connector-client";
import { useCallback, useEffect, useState } from "react";

interface ListHook<T> {
  items: T[];
  error: Error | null;
  isLoading: boolean;
  setQuerySpec: (querySpec: QuerySpec) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [shouldSearch, setSohuldSearch] = useState(false);

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
          setSohuldSearch(false);
        }
      }
    )();
  }, [queryAll, querySpec, shouldSearch]);

  return {
    items,
    error,
    isLoading,
    setQuerySpec,
    searchQuery,
    setSearchQuery,
    deleteItem,
    triggerSearch: () => {
      setQuerySpec({
        ...querySpec,
        filterExpression: searchQuery
          ? [
            {
              operandLeft: "edc:name",
              operator: "=",
              operandRight: searchQuery,
            },
          ]
          : [],
      });
      setSohuldSearch(true);
    },
  };
}
