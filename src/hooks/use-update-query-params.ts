import { useRouter } from "next/router"
import { useCallback } from "react"

export const useUpdateQueryParams = (options?: { clearQueryParams: boolean }) => {
  const { push, query } = useRouter()

  let oldQueryParams = query

  if (options?.clearQueryParams) {
    oldQueryParams = {}
  }

  return useCallback((queryParams: Record<string, string>) => push({
    href: window.location.href,
    query: {
      ...query,
      ...queryParams
    }
  }), [push, query])
}
