import { CriterionInput, QuerySpec } from "@think-it-labs/edc-connector-client";
import { useCallback, useEffect, useReducer } from "react";
import { SearchSpec } from "../types";

interface ListHook<T> {
  items: T[];
  errors: Error[] | null;
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
  errors: Error[] | null;
  isLoading: boolean;
  shouldSearch: boolean;
};

type Action<T> =
  | { type: "SET_BASE_QUERY"; payload: QuerySpec }
  | { type: "SET_SEARCH_FILTER"; payload: Partial<SearchSpec> }
  | { type: "TRIGGER_SEARCH" }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: T[] }
  | { type: "FETCH_ERROR"; payload: Error[] };

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
      return { ...state, isLoading: true, errors: null };

    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, shouldSearch: false, items: action.payload };

    case "FETCH_ERROR":
      return { ...state, isLoading: false, shouldSearch: false, errors: action.payload };

    default:
      return state;
  }
}

function wrapSearchOperandRight(
  operator: SearchSpec["operator"],
  value: string | string[]
): string | string[] {
  const shouldWrap = operator === "like" || operator === "ilike";
  if (!shouldWrap) return value;
  if (Array.isArray(value)) return value.map((v) => `%${v}%`);
  return `%${value}%`;
}

function buildFinalQuery(baseQuery: QuerySpec, searchFilter: SearchSpec): QuerySpec[] {
  const baseFilters = baseQuery.filterExpression ?? [];
  const andFilters: CriterionInput[] = baseFilters
    .filter((f) => !Array.isArray(f.operandLeft))
    .map((f) => ({
      operandLeft: f.operandLeft as string,
      operator: f.operator,
      operandRight: f.operandRight,
    }));

  const orGroups: CriterionInput[][] = baseFilters
    .filter((f): f is CriterionInput & { operandLeft: string[] } => Array.isArray(f.operandLeft))
    .map((f) => {
      const uniqueLefts = Array.from(new Set(f.operandLeft));
      return uniqueLefts.map((operandLeft) => ({
        operandLeft,
        operator: f.operator,
        operandRight: f.operandRight,
      }));
    })
    .filter((group) => group.length > 0);

  let hasSearch = false;
  if (searchFilter.operandRight !== undefined && searchFilter.operandRight !== null) {
    if (typeof searchFilter.operandRight === "string") {
      hasSearch = searchFilter.operandRight.trim() !== "";
    } else if (Array.isArray(searchFilter.operandRight)) {
      hasSearch = searchFilter.operandRight.length > 0;
    }
  }

  let operandRight: string | string[] | undefined = undefined;
  if (hasSearch) {
    operandRight = wrapSearchOperandRight(searchFilter.operator, searchFilter.operandRight);
  }

  const searchAnd: CriterionInput[] = [];
  if (hasSearch && !Array.isArray(searchFilter.operandLeft)) {
    searchAnd.push({
      operandLeft: searchFilter.operandLeft,
      operator: searchFilter.operator,
      operandRight: operandRight as string | string[],
    });
  }

  const searchOrGroups: CriterionInput[][] = [];
  if (hasSearch && Array.isArray(searchFilter.operandLeft)) {
    const unique = Array.from(new Set(searchFilter.operandLeft));
    const group = unique.map((operandLeft) => ({
      operandLeft,
      operator: searchFilter.operator,
      operandRight: operandRight as string | string[],
    }));
    searchOrGroups.push(group);
  }

  const allAndFilters = [...andFilters, ...searchAnd];
  const allOrGroups = [...orGroups, ...searchOrGroups];

  if (allOrGroups.length === 0) {
    return [{ ...baseQuery, filterExpression: allAndFilters }];
  }

  const combinations = allOrGroups.reduce<CriterionInput[][]>(
    (acc, group) =>
      acc.length === 0
        ? group.map((choice) => [choice])
        : acc.flatMap((prefix) => group.map((choice) => [...prefix, choice])),
    []
  );

  return combinations.map((combo) => ({
    ...baseQuery,
    filterExpression: [...allAndFilters, ...combo],
  }));
}

function getId(value: unknown): string | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const record = value as Record<string, unknown>;
  const id = record["@id"];
  return typeof id === "string" ? id : undefined;
}

function mergeAndDedupeById<T>(lists: T[][]): T[] {
  const seenIds = new Set<string>();
  return lists
    .flat()
    .filter((item) => {
      const id = getId(item);
      if (id === undefined) return true;
      if (seenIds.has(id)) return false;
      seenIds.add(id);
      return true;
    });
}

function toError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
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
    errors: null,
    isLoading: false,
    shouldSearch: false,
  });

  const fetchData = useCallback(async (queries: QuerySpec[]) => {
    if (!shouldFetch) return;

    dispatch({ type: "FETCH_START" });

    const settled = await Promise.allSettled(queries.map((q) => queryAll(q)));

    const fulfilledValues = settled
      .filter((r): r is PromiseFulfilledResult<T[]> => r.status === "fulfilled")
      .map((r) => r.value);

    const errorMessages = settled
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map(({ reason }) => {
        return (reason instanceof Error ? reason : new Error(reason))
      }

      );

    const merged = mergeAndDedupeById<T>(fulfilledValues);
    dispatch({ type: "FETCH_SUCCESS", payload: merged });

    if (errorMessages.length > 0) {
      dispatch({
        type: "FETCH_ERROR",
        payload: errorMessages
      });
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
      dispatch({ type: "FETCH_ERROR", payload: [toError(err)] });
    }
  }, [deleteApi, state.baseQuery, state.searchFilter, fetchData]);

  return {
    items: state.items,
    errors: state.errors,
    isLoading: state.isLoading,
    setQuerySpec,
    searchSpec: state.searchFilter,
    setSearchSpec,
    triggerSearch,
    deleteItem,
  };
}
