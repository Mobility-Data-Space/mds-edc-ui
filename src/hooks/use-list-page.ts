import { useUpdateQueryParams } from "@/hooks/use-update-query-params";
import { useRouter } from "next/router";
import { useCallback } from "react";

// Keeps a paginated list's current page in the `page` query param.
export function useListPage() {
  const { query } = useRouter();
  const updateQueryParams = useUpdateQueryParams();

  const currentPage = parseInt(query.page as string) || 0;
  const navigate = useCallback(
    (newPage: number) => {
      updateQueryParams({ page: String(newPage) });
    },
    [updateQueryParams],
  );

  return { currentPage, navigate };
}
