'use client';
import { useState } from "react";

type TimeoutId = ReturnType<typeof setTimeout>;

export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 600,
): { loading: boolean; debounce: (...args: Parameters<T>) => void } {
  const [loading, setLoading] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<TimeoutId>();
  return {
    loading,
    debounce: (...args: Parameters<T>): void => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setLoading(true);
      setTimeoutId(
        setTimeout(() => {
          func.apply(null, args);
          setLoading(false);
        }, delay),
      );
    },
  };
}
