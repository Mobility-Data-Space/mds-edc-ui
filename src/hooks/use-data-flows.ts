import { proxyConnectorManagement } from "@/constants/proxy";
import { CONTEXT_EDC } from "@/jsonld/context";
import { DataFlow } from "@/domain/data-flow/model";
import { toDataFlows } from "@/domain/data-flow/mapper";
import { useCallback, useEffect, useState } from "react";

const EDC = CONTEXT_EDC.value;

interface UseDataFlowsParams {
  page: number;
  limit: number;
  /** Optional assetId substring filter. */
  search?: string;
}

interface UseDataFlowsResult {
  dataFlows: DataFlow[];
  loading: boolean;
  error: Error | null;
  /** True when a further page is available (we over-fetch by one to tell). */
  hasNext: boolean;
}

const buildQuerySpec = ({ page, limit, search }: UseDataFlowsParams) => {
  const filterExpression = search
    ? [
        {
          "@type": "Criterion",
          operandLeft: "assetId",
          operator: "ilike",
          operandRight: `%${search}%`,
        },
      ]
    : [];

  return {
    "@context": { "@vocab": EDC },
    "@type": "QuerySpec",
    offset: page * limit,
    // Over-fetch by one so we can offer a "next page" without a total count.
    limit: limit + 1,
    sortField: "stateTimestamp",
    sortOrder: "DESC",
    filterExpression,
  };
};

/** Fetches a page of data flows from POST /v4/dataflows/request. */
export const useDataFlows = ({
  page,
  limit,
  search,
}: UseDataFlowsParams): UseDataFlowsResult => {
  const [dataFlows, setDataFlows] = useState<DataFlow[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${proxyConnectorManagement}/v4/dataflows/request`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(buildQuerySpec({ page, limit, search })),
          signal,
        },
      );
      if (!response.ok) {
        throw new Error(`Failed to load data flows: ${response.status}`);
      }
      const all = toDataFlows(await response.json());
      setHasNext(all.length > limit);
      setDataFlows(all.slice(0, limit));
    } catch (reason: unknown) {
      if (signal.aborted) return;
      setError(reason instanceof Error ? reason : new Error(String(reason)));
      setDataFlows([]);
      setHasNext(false);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { dataFlows, loading, error, hasNext };
};
