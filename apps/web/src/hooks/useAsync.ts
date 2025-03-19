import { useState, useCallback } from "react";

type AsyncFunction<T> = () => Promise<T>;

export const useAsync = <T>(asyncFunction: AsyncFunction<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      const result = await asyncFunction();
      setData(result);
      setError(null);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  return { data, loading, error, execute };
};
