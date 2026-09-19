import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTransaction } from '../../../src/presentation/hooks/useTransaction';
import { ApiError } from '../../../src/domain/errors/ApiError';
import * as di from '../../../src/infrastructure/di';

describe('useTransaction Hook', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deposit, withdraw y transfer ejecutan correctamente con y sin onSuccess', async () => {
    const depositRes = { accountId: 'a1', newBalance: 500, depositedAt: '2026-09-19T00:00:00Z' };
    const withdrawRes = { accountId: 'a1', newBalance: 300, withdrawnAt: '2026-09-19T00:00:00Z' };
    const transferRes = {
      id: 'tx-1',
      type: 'TRANSFER' as const,
      amount: 100,
      status: 'COMPLETED' as const,
      createdAt: '2026-09-19T00:00:00Z',
      sourceAccountId: 'a1',
      destinationAccountId: 'a2',
    };

    vi.spyOn(di.depositUseCase, 'execute').mockResolvedValue(depositRes);
    vi.spyOn(di.withdrawUseCase, 'execute').mockResolvedValue(withdrawRes);
    vi.spyOn(di.transferMoneyUseCase, 'execute').mockResolvedValue(transferRes);

    const { result } = renderHook(() => useTransaction());

    const onSuccess1 = vi.fn();
    const onSuccess2 = vi.fn();
    const onSuccess3 = vi.fn();

    await act(async () => {
      await result.current.deposit({ accountId: 'a1', amount: 200 }, onSuccess1);
    });
    expect(result.current.lastResult).toEqual(depositRes);
    expect(onSuccess1).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.withdraw({ accountId: 'a1', amount: 200 }, onSuccess2);
    });
    expect(result.current.lastResult).toEqual(withdrawRes);
    expect(onSuccess2).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.transfer({ sourceAccountId: 'a1', destinationAccountId: 'a2', amount: 100 }, onSuccess3);
    });
    expect(result.current.lastResult).toEqual(transferRes);
    expect(onSuccess3).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.clearState();
    });
    expect(result.current.status).toBe('idle');
  });

  it('maneja ApiError, Error y non-Error en deposit, withdraw y transfer', async () => {
    vi.spyOn(di.depositUseCase, 'execute')
      .mockRejectedValueOnce(new ApiError('Deposit Api Error', 400, 'DEP_ERR'))
      .mockRejectedValueOnce('Error string');

    vi.spyOn(di.withdrawUseCase, 'execute')
      .mockRejectedValueOnce(new ApiError('Withdraw Api Error', 400, 'WD_ERR'))
      .mockRejectedValueOnce('Error string');

    vi.spyOn(di.transferMoneyUseCase, 'execute')
      .mockRejectedValueOnce(new ApiError('Transfer Api Error', 400, 'TR_ERR'))
      .mockRejectedValueOnce('Error string');

    const { result } = renderHook(() => useTransaction());

    await act(async () => {
      await result.current.deposit({ accountId: 'a1', amount: 100 });
    });
    expect(result.current.error?.code).toBe('DEP_ERR');

    await act(async () => {
      await result.current.deposit({ accountId: 'a1', amount: 100 });
    });
    expect(result.current.error?.message).toBe('Error al realizar el depósito');

    await act(async () => {
      await result.current.withdraw({ accountId: 'a1', amount: 100 });
    });
    expect(result.current.error?.code).toBe('WD_ERR');

    await act(async () => {
      await result.current.withdraw({ accountId: 'a1', amount: 100 });
    });
    expect(result.current.error?.message).toBe('Error al realizar el retiro');

    await act(async () => {
      await result.current.transfer({ sourceAccountId: 'a1', destinationAccountId: 'a2', amount: 100 });
    });
    expect(result.current.error?.code).toBe('TR_ERR');

    await act(async () => {
      await result.current.transfer({ sourceAccountId: 'a1', destinationAccountId: 'a2', amount: 100 });
    });
    expect(result.current.error?.message).toBe('Error al realizar la transferencia');
  });
});
