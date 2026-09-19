import { useState, useCallback } from 'react';
import {
  DepositParams,
  DepositResult,
  WithdrawParams,
  WithdrawResult,
  TransferParams,
} from '../../domain/repositories/TransactionRepository';
import { TransactionRecord } from '../../domain/entities/Transaction';
import { ApiError } from '../../domain/errors/ApiError';
import { depositUseCase, withdrawUseCase, transferMoneyUseCase } from '../../infrastructure/di';

export type TransactionStatusState = 'idle' | 'loading' | 'success' | 'error';

export interface UseTransactionResult {
  status: TransactionStatusState;
  isLoading: boolean;
  error: ApiError | null;
  lastResult: DepositResult | WithdrawResult | TransactionRecord | null;
  deposit: (params: DepositParams, onSuccess?: () => void) => Promise<DepositResult | null>;
  withdraw: (params: WithdrawParams, onSuccess?: () => void) => Promise<WithdrawResult | null>;
  transfer: (params: TransferParams, onSuccess?: () => void) => Promise<TransactionRecord | null>;
  clearState: () => void;
}

export const useTransaction = (): UseTransactionResult => {
  const [status, setStatus] = useState<TransactionStatusState>('idle');
  const [error, setError] = useState<ApiError | null>(null);
  const [lastResult, setLastResult] = useState<DepositResult | WithdrawResult | TransactionRecord | null>(null);

  const clearState = useCallback(() => {
    setStatus('idle');
    setError(null);
    setLastResult(null);
  }, []);

  const deposit = useCallback(
    async (params: DepositParams, onSuccess?: () => void): Promise<DepositResult | null> => {
      setStatus('loading');
      setError(null);
      try {
        const result = await depositUseCase.execute(params);
        setLastResult(result);
        setStatus('success');
        if (onSuccess) {
          onSuccess();
        }
        return result;
      } catch (err: unknown) {
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(err instanceof Error ? err.message : 'Error al realizar el depósito', 400, 'DEPOSIT_ERROR');
        setError(apiError);
        setStatus('error');
        return null;
      }
    },
    []
  );

  const withdraw = useCallback(
    async (params: WithdrawParams, onSuccess?: () => void): Promise<WithdrawResult | null> => {
      setStatus('loading');
      setError(null);
      try {
        const result = await withdrawUseCase.execute(params);
        setLastResult(result);
        setStatus('success');
        if (onSuccess) {
          onSuccess();
        }
        return result;
      } catch (err: unknown) {
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(err instanceof Error ? err.message : 'Error al realizar el retiro', 400, 'WITHDRAW_ERROR');
        setError(apiError);
        setStatus('error');
        return null;
      }
    },
    []
  );

  const transfer = useCallback(
    async (params: TransferParams, onSuccess?: () => void): Promise<TransactionRecord | null> => {
      setStatus('loading');
      setError(null);
      try {
        const result = await transferMoneyUseCase.execute(params);
        setLastResult(result);
        setStatus('success');
        if (onSuccess) {
          onSuccess();
        }
        return result;
      } catch (err: unknown) {
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(err instanceof Error ? err.message : 'Error al realizar la transferencia', 400, 'TRANSFER_ERROR');
        setError(apiError);
        setStatus('error');
        return null;
      }
    },
    []
  );

  return {
    status,
    isLoading: status === 'loading',
    error,
    lastResult,
    deposit,
    withdraw,
    transfer,
    clearState,
  };
};
