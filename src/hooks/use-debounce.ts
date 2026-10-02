"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type TimeoutId = ReturnType<typeof setTimeout>;

export function useDebounce<A extends unknown[]>(
  func: (...args: A) => unknown,
  delay: number = 600,
): { loading: boolean; debounce: (...args: A) => void } {
  const [loading, setLoading] = useState<boolean>(false);
  const timeoutRef = useRef<TimeoutId | undefined>(undefined);
  const funcRef = useRef(func);

  useEffect(() => {
    funcRef.current = func;
  }, [func]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const debounceHandler = useCallback(
    (...args: A) => {
      clearTimeout(timeoutRef.current);
      setLoading(true);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = undefined;
        funcRef.current(...args);
        setLoading(false);
      }, delay);
    },
    [delay],
  );

  return {
    loading,
    debounce: debounceHandler,
  };
}
