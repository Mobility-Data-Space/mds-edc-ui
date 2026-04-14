"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type TimeoutId = ReturnType<typeof setTimeout>;

export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 600,
): { loading: boolean; debounce: (...args: Parameters<T>) => void } {
  const [loading, setLoading] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<TimeoutId>();
  const funcRef = useRef(func);

  useEffect(() => {
    funcRef.current = func;
  }, [func]);

  const debounceHandler = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setLoading(true);
      setTimeoutId(
        setTimeout(() => {
          funcRef.current(...args);
          setLoading(false);
        }, delay),
      );
    },
    [delay, timeoutId],
  );

  return {
    loading,
    debounce: debounceHandler,
  };
}
