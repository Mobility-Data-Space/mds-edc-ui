import { QuerySpec } from "@think-it-labs/edc-connector-client";
import { useCallback, useEffect, useReducer } from "react";
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
  shouldFetch?: boolean;
}

type State<T> = {
  baseQuery: QuerySpec;
  searchFilter: SearchSpec;
  items: T[];
  error: Error | null;
  isLoading: boolean;
  shouldSearch: boolean;
};

type Action<T> =
  | { type: "SET_BASE_QUERY"; payload: QuerySpec }
  | { type: "SET_SEARCH_FILTER"; payload: Partial<SearchSpec> }
  | { type: "TRIGGER_SEARCH" }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: T[] }
  | { type: "FETCH_ERROR"; payload: Error };

const initialSearchFilter: SearchSpec = {
  operandLeft: "edc:name",
  operator: "=",
  operandRight: "",
};

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "SET_BASE_QUERY":
      return { ...state, baseQuery: action.payload };

    case "SET_SEARCH_FILTER":
      return { ...state, searchFilter: { ...state.searchFilter, ...action.payload } };

    case "TRIGGER_SEARCH":
      return { ...state, shouldSearch: true };

    case "FETCH_START":
      return { ...state, isLoading: true, error: null };

    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, shouldSearch: false, items: action.payload };

    case "FETCH_ERROR":
      return { ...state, isLoading: false, shouldSearch: false, error: action.payload };

    default:
      return state;
  }
}

function buildFinalQuery(baseQuery: QuerySpec, searchFilter: SearchSpec): QuerySpec {
  let filterExpression = Array.isArray(baseQuery.filterExpression)
    ? [...baseQuery.filterExpression]
    : [];

  if (searchFilter.operandRight) {
    const shouldWrap =
      (searchFilter.operator === "ilike" || searchFilter.operator === "like");

    const operandRight = shouldWrap
      ? `%${searchFilter.operandRight}%`
      : searchFilter.operandRight;

    filterExpression.push({
      ...searchFilter,
      operandRight
    });
  }

  return {
    ...baseQuery,
    filterExpression: filterExpression.length > 0 ? filterExpression : undefined,
  };
}

export function useList<T>({
  queryAll,
  delete: deleteApi,
  shouldFetch = true
}: UseListOptions<T>): ListHook<T> {

  const [state, dispatch] = useReducer(reducer<T>, {
    baseQuery: {},
    searchFilter: initialSearchFilter,
    items: [],
    error: null,
    isLoading: false,
    shouldSearch: false,
  });

  const fetchData = useCallback(async (query: QuerySpec) => {
    if (!shouldFetch) return;

    try {
      dispatch({ type: "FETCH_START" });
      const response = await queryAll(query);
      dispatch({ type: "FETCH_SUCCESS", payload: response });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err as Error });
    }
  }, [queryAll, shouldFetch]);

  useEffect(() => {
    const query = buildFinalQuery(state.baseQuery, state.searchFilter);

    const hasBaseQuery = Object.keys(state.baseQuery).length > 0;
    const hasSearchFilter = state.searchFilter.operandRight;

    if (hasBaseQuery || hasSearchFilter) {
      fetchData(query);
    }
  }, [state.baseQuery, fetchData]);

  useEffect(() => {
    if (!state.shouldSearch) return;

    const query = buildFinalQuery(state.baseQuery, state.searchFilter);
    fetchData(query);
  }, [state.shouldSearch, state.baseQuery, state.searchFilter, fetchData]);

  const setQuerySpec = useCallback((querySpec: QuerySpec) => {
    dispatch({ type: "SET_BASE_QUERY", payload: querySpec });
  }, []);

  const setSearchSpec = useCallback((searchSpec: Partial<SearchSpec>) => {
    dispatch({ type: "SET_SEARCH_FILTER", payload: searchSpec });
  }, []);

  const triggerSearch = useCallback(() => {
    dispatch({ type: "TRIGGER_SEARCH" });
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    try {
      await deleteApi(id);
      const query = buildFinalQuery(state.baseQuery, state.searchFilter);
      fetchData(query);
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err as Error });
    }
  }, [deleteApi, state.baseQuery, state.searchFilter, fetchData]);

  return {
    items: state.items,
    error: state.error,
    isLoading: state.isLoading,
    setQuerySpec,
    searchSpec: state.searchFilter,
    setSearchSpec,
    triggerSearch,
    deleteItem,
  };
}
