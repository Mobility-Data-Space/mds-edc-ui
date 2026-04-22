import { useRouter } from "next/router"
import { useCallback } from "react"

export const useUpdateQueryParams = (options?: { clearQueryParams: boolean }) => {
  const { push, query, pathname } = useRouter()

  return useCallback((queryParams: Record<string, string>) => {
    const oldQueryParams = options?.clearQueryParams ? {} : query

    return push(
      {
        pathname,
        query: {
          ...oldQueryParams,
          ...queryParams
        }
      },
      undefined,
      { shallow: true }
    )
  }, [push, query, pathname, options?.clearQueryParams])
}
