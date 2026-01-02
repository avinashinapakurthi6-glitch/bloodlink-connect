/**
 * useDataFetch - Generic hook for fetching data with loading and error states
 */

import { useEffect, useState, useCallback } from 'react';
import { ApiResponse, ApiError } from '@/services/api';

export interface UseDataFetchState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useDataFetch<T>(
  fetchFn: () => Promise<ApiResponse<T>>,
  dependencies: unknown[] = []
): UseDataFetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await fetchFn();

    if (response.success) {
      setData(response.data);
      setError(null);
    } else {
      setData(null);
      setError(response.error);
    }

    setLoading(false);
  }, [fetchFn]);

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
}
