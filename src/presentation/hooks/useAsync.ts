import { useState, useCallback } from 'react';
import { ApiError } from '../../domain/errors/ApiError';

export type UiStateStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export interface UseAsyncResult<T> {
  data: T | null;
  status: UiStateStatus;
  error: ApiError | null;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  isSuccess: boolean;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

export function useAsync<T>(
  asyncFunction: (...args: unknown[]) => Promise<T>,
  checkIsEmpty?: (data: T) => boolean
): UseAsyncResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<UiStateStatus>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setStatus('loading');
      setError(null);
      try {
        const result = await asyncFunction(...args);
        setData(result);
        
        const empty = checkIsEmpty
          ? checkIsEmpty(result)
          : Array.isArray(result) && result.length === 0;

        setStatus(empty ? 'empty' : 'success');
        return result;
      } catch (err) {
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(err instanceof Error ? err.message : 'Error al procesar la solicitud', 500, 'UNKNOWN');
        setError(apiError);
        setStatus('error');
        return null;
      }
    },
    [asyncFunction, checkIsEmpty]
  );

  const reset = useCallback(() => {
    setData(null);
    setStatus('idle');
    setError(null);
  }, []);

  return {
    data,
    status,
    error,
    isLoading: status === 'loading',
    isError: status === 'error',
    isEmpty: status === 'empty',
    isSuccess: status === 'success',
    execute,
    reset,
  };
}
