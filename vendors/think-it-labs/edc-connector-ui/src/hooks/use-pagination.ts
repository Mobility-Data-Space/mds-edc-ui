import { useCallback, useState } from "react";

interface PaginationProps {
  firstPage?: number,
  page: number,
  navigate: (newPage: number) => void
}

export function usePagination({ firstPage = 0, page, navigate }: PaginationProps) {
  const [hasNext, setHasNext] = useState(true)
  const incrementPage = useCallback(
    () => {
      const newPage = page + 1;
      navigate(newPage)
    },
    [
      page,
      navigate
    ],
  );

  const decrementPage = useCallback(
    () => {
      const newPage = Math.max(page - 1, firstPage);
      navigate(newPage)
    },
    [
      page,
      navigate,
      firstPage
    ],
  );

  return {
    page,
    hasPrev: page !== firstPage,
    hasNext: hasNext,
    setHasNext: setHasNext,
    incrementPage,
    decrementPage,
  };
}
