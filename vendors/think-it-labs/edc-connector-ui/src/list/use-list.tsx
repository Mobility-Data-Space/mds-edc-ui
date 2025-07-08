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
  querySpecBase: QuerySpec;
  searchSpec: SearchSpec;
  committedSearchSpec: SearchSpec;
  items: T[];
  error: Error | null;
  isLoading: boolean;
  shouldSearch: boolean;
};

type Action<T> =
  | { type: "SET_QUERY_SPEC_BASE"; payload: QuerySpec }
  | { type: "SET_SEARCH_SPEC"; payload: Partial<SearchSpec> }
  | { type: "TRIGGER_SEARCH" }
  | { type: "SEARCH_START" }
  | { type: "SEARCH_SUCCESS"; payload: T[] }
  | { type: "SEARCH_ERROR"; payload: Error };

const initialSearchSpec: SearchSpec = {
  operandLeft: "edc:name",
  operator: "=",
  operandRight: "",
};

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "SET_QUERY_SPEC_BASE":
      return { ...state, querySpecBase: { ...state.querySpecBase, ...action.payload } };
    case "SET_SEARCH_SPEC":
      return { ...state, searchSpec: { ...state.searchSpec, ...action.payload } };
    case "TRIGGER_SEARCH":
      return {
        ...state,
        committedSearchSpec: state.searchSpec,
        shouldSearch: true,
      };
    case "SEARCH_START":
      return { ...state, isLoading: true, error: null };
    case "SEARCH_SUCCESS":
      return { ...state, isLoading: false, shouldSearch: false, items: action.payload };
    case "SEARCH_ERROR":
      return { ...state, isLoading: false, shouldSearch: false, error: action.payload };
    default:
      return state;
  }
}

export function useList<T>({ queryAll, delete: del, shouldFetch = true }: UseListOptions<T>): ListHook<T> {
  const [state, dispatch] = useReducer(reducer<T>, {
    querySpecBase: {},
    searchSpec: initialSearchSpec,
    committedSearchSpec: initialSearchSpec,
    items: [],
    error: null,
    isLoading: false,
    shouldSearch: false,
  });

  const deleteItem = useCallback((id: string) => del(id), [del]);

  const buildQuerySpec = useCallback(() => {
    const { querySpecBase, committedSearchSpec } = state;
    let filterExpression = Array.isArray(querySpecBase.filterExpression)
      ? [...querySpecBase.filterExpression]
      : [];
    if (committedSearchSpec.operandRight) {
      const shouldWrap =
        (committedSearchSpec.operator === "ilike" || committedSearchSpec.operator === "like") &&
        committedSearchSpec.operandRight;
      const operandRight = shouldWrap
        ? `%${committedSearchSpec.operandRight}%`
        : committedSearchSpec.operandRight;
      filterExpression.push({ ...committedSearchSpec, operandRight });
    }

    const querySpec: QuerySpec = {
      ...state.querySpecBase,
      filterExpression: filterExpression.length > 0 ? filterExpression : undefined,
    };
    return querySpec;
  }, [state.querySpecBase, state.committedSearchSpec]);

  useEffect(() => {
    if (!shouldFetch) return;
    // Only fetch if there is a filter or some required field in querySpecBase
    const hasBase = state.querySpecBase && Object.keys(state.querySpecBase).length > 0;
    const hasSearch = state.committedSearchSpec && state.committedSearchSpec.operandRight;
    if (!hasBase && !hasSearch) return;
    dispatch({ type: "SEARCH_START" });
    queryAll(buildQuerySpec())
      .then((response) => {
        dispatch({ type: "SEARCH_SUCCESS", payload: response });
      })
      .catch((err) => {
        dispatch({ type: "SEARCH_ERROR", payload: err as Error });
      });
  }, [state.querySpecBase, state.committedSearchSpec, shouldFetch]);

  useEffect(() => {
    if (!state.shouldSearch) return;
    dispatch({ type: "SEARCH_START" });
    queryAll(buildQuerySpec())
      .then((response) => {
        dispatch({ type: "SEARCH_SUCCESS", payload: response });
      })
      .catch((err) => {
        dispatch({ type: "SEARCH_ERROR", payload: err as Error });
      });
  }, [state.shouldSearch]);

  const setQuerySpec = useCallback((querySpec: QuerySpec) => {
    dispatch({ type: "SET_QUERY_SPEC_BASE", payload: querySpec });
  }, []);

  const setSearchSpec = useCallback((searchSpec: Partial<SearchSpec>) => {
    dispatch({ type: "SET_SEARCH_SPEC", payload: searchSpec });
  }, []);

  const triggerSearch = useCallback(() => {
    dispatch({ type: "TRIGGER_SEARCH" });
  }, []);

  return {
    items: state.items,
    error: state.error,
    isLoading: state.isLoading,
    setQuerySpec,
    searchSpec: state.searchSpec,
    setSearchSpec,
    deleteItem,
    triggerSearch,
  };
}
