import { useCallback, useEffect, useState } from "react";

interface ViewHook<T> {
  item: T | null;
  error: Error | null;
  isLoading: boolean;
  deleteAsset: () => Promise<void>;
}

interface UseViewOptions<T> {
  get: () => Promise<T>;
  delete: () => Promise<void>;
}

export function useView<T>(
  { get, delete: del }: UseViewOptions<T>,
): ViewHook<T> {
  const [item, setItem] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState(false);

  const deleteAsset = useCallback(() => del(), [
    del,
  ]);

  useEffect(() => {
    (
      async function () {
        try {
          setLoading(true);
          const response = await get();
          setItem(response);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      }
    )();
  }, [get]);

  return {
    item,
    error,
    isLoading,
    deleteAsset,
  };
}
