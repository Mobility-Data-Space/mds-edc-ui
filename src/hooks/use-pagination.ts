import { useRouter } from "next/router";
import { useCallback, useState } from "react";

const FIRST_PAGE = 0;
const ITEMS = 25;

export function usePagination() {
  const { query, route, push } = useRouter();
  const [page, setPage] = useState(
    parseInt(query.page as string) || FIRST_PAGE,
  );
  const incrementPage = useCallback(
    () => {
      const newPage = page + 1;
      setPage(newPage);
      push(
        {
          href: window.location.href,
          query: {
            ...query,
            page: newPage,
          },
        },
      );
    },
    [
      query,
      page,
      push,
    ],
  );

  const decrementPage = useCallback(
    () => {
      const newPage = Math.max(page - 1, FIRST_PAGE);
      setPage(Math.max(newPage, FIRST_PAGE));
      push(
        {
          href: window.location.href,
          query: {
            ...query,
            page: newPage,
          },
        },
      );
    },
    [
      page,
      push,
      query,
    ],
  );

  return {
    page,
    hasPrev: page !== FIRST_PAGE,
    incrementPage,
    decrementPage,
    limit: ITEMS,
    offset: ITEMS * page,
  };
}
