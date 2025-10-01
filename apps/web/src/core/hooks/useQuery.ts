import { useState, useEffect, useCallback, useRef } from "react";
import { useApi } from "./useApi";
import { ApiResponse, ApiError } from "../interfaces/IService";
import { queryCache } from "./useQueryCache";

export interface UseQueryOptions<T> {
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  apiError: ApiError | null;
  refetch: () => Promise<T | null>;
  isStale: boolean;
  lastFetched: Date | null;
}

export function useQuery<T>(
  queryKey: string,
  queryFn: () => Promise<ApiResponse<T>>,
  options: UseQueryOptions<T> = {},
): UseQueryResult<T> {
  const {
    enabled = true,
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000, // 5 minutes
    onSuccess,
    onError,
  } = options;

  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [isStale, setIsStale] = useState(true);

  const api = useApi(queryFn, { onSuccess, onError });
  // Stabilize execute to avoid refetch identity changes on state updates
  const executeRef = useRef(api.execute);
  useEffect(() => {
    executeRef.current = api.execute;
  }, [api.execute]);

  const refetch = useCallback(async (): Promise<T | null> => {
    // Check cache first
    const cached = queryCache.get(queryKey);
    if (cached && !isStale) {
      return cached;
    }

    // Check if request is already pending
    if (queryCache.isPending(queryKey)) {
      const pending = queryCache.get(queryKey);
      if (pending?.promise) {
        return await pending.promise;
      }
    }

    // Make new request
    const promise = executeRef.current();
    queryCache.setPending(queryKey, promise);

    try {
      const result = await promise;
      if (result !== null) {
        setLastFetched(new Date());
        setIsStale(false);
        queryCache.set(queryKey, result);
      }
      queryCache.clearPending(queryKey);
      return result;
    } catch (error) {
      queryCache.clearPending(queryKey);
      throw error;
    }
  }, [queryKey, isStale]);

  // Initial fetch
  useEffect(() => {
    if (
      enabled &&
      (refetchOnMount || lastFetched === null) &&
      (isStale || lastFetched === null)
    ) {
      refetch();
    }
  }, [enabled, refetchOnMount, isStale, lastFetched, refetch]);

  // Window focus refetch
  useEffect(() => {
    if (!refetchOnWindowFocus || !enabled) return;

    const handleFocus = () => {
      if (isStale) {
        refetch();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refetchOnWindowFocus, enabled, isStale, refetch]);

  // Stale time management
  useEffect(() => {
    if (lastFetched && staleTime > 0) {
      const timer = setTimeout(() => {
        setIsStale(true);
      }, staleTime);

      return () => clearTimeout(timer);
    }
  }, [lastFetched, staleTime]);

  return {
    data: api.data,
    loading: api.loading,
    error: api.error,
    apiError: api.apiError,
    refetch,
    isStale,
    lastFetched,
  };
}
