import { useCallback, useEffect, useState } from "react";

const cache = new Map<string, any>();

interface ViewHook<T> {
  item: T | null;
  error: Error | null;
  isLoading: boolean;
  deleteAsset: () => Promise<void>;
}

interface UseViewOptions<T> {
  get: () => Promise<T>;
  delete: () => Promise<void>;
  cacheKey?: string;
}

export function useView<T>(
  { get, delete: del, cacheKey }: UseViewOptions<T>,
): ViewHook<T> {
  const [item, setItem] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState(false);

  const deleteAsset = useCallback(async () => {
    await del();
    if (cacheKey) {
      cache.delete(cacheKey);
    }
  }, [del, cacheKey]);

  useEffect(() => {
    (
      async function () {
        try {
          setLoading(true);

          // Check cache first
          if (cacheKey && cache.has(cacheKey)) {
            const cachedItem = cache.get(cacheKey);
            setItem(cachedItem);
            setLoading(false);
            return;
          }

          const response = await get();
          setItem(response);

          // Store in cache
          if (cacheKey) {
            cache.set(cacheKey, response);
          }
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      }
    )();
  }, [get, cacheKey]);

  return {
    item,
    error,
    isLoading,
    deleteAsset,
  };
}
