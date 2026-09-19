import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider } from '../../../src/presentation/context/AuthContext';
import { useAuth } from '../../../src/presentation/hooks/useAuth';
import { useAccount } from '../../../src/presentation/hooks/useAccount';
import { ApiError } from '../../../src/domain/errors/ApiError';
import { TokenStorage } from '../../../src/infrastructure/storage/TokenStorage';
import * as di from '../../../src/infrastructure/di';

describe('useAccount Hook', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    TokenStorage.removeToken();
  });

  it('obtiene cuentas del usuario al estar autenticado y maneja estado vacio', async () => {
    vi.spyOn(di.getUserAccountsUseCase, 'execute').mockResolvedValue([]);

    const mockSession = { token: 'jwt-123', user: { id: 'u1', name: 'User 1', email: 'u1@test.com' } };
    vi.spyOn(di.loginUserUseCase, 'execute').mockResolvedValue(mockSession);

    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

    const { result } = renderHook(
      () => ({ auth: useAuth(), account: useAccount() }),
      { wrapper }
    );
    await act(async () => {
      await result.current.auth.login({ email: 'u1@test.com', password: 'password123' });
    });

    await act(async () => {
      await result.current.account.fetchAccounts();
    });

    expect(result.current.account.status).toBe('empty');
  });

  it('maneja ApiError y errores genéricos en fetchAccounts, createAccount, freezeAccount, unfreezeAccount, selectAccount y retry()', async () => {
    vi.spyOn(di.getUserAccountsUseCase, 'execute')
      .mockRejectedValueOnce(new ApiError('Api fetch error', 500, 'FETCH_FAIL'))
      .mockRejectedValue(new Error('Error al consultar cuentas'));

    vi.spyOn(di.createAccountUseCase, 'execute')
      .mockRejectedValueOnce(new ApiError('Api create error', 400, 'CREATE_FAIL'))
      .mockRejectedValueOnce('Non error');

    vi.spyOn(di.freezeAccountUseCase, 'execute')
      .mockRejectedValueOnce(new ApiError('Api freeze error', 400, 'FREEZE_FAIL'))
      .mockRejectedValueOnce('Non error');

    vi.spyOn(di.unfreezeAccountUseCase, 'execute')
      .mockRejectedValueOnce(new ApiError('Api unfreeze error', 400, 'UNFREEZE_FAIL'))
      .mockRejectedValueOnce('Non error');

    vi.spyOn(di.getBalanceUseCase, 'execute')
      .mockRejectedValueOnce(new ApiError('Api balance error', 500, 'BALANCE_FAIL'))
      .mockRejectedValueOnce('Non error');

    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAccount(), { wrapper });

    await act(async () => {
      await result.current.fetchAccounts();
    });
    expect(result.current.error?.code).toBe('FETCH_FAIL');

    await act(async () => {
      const created = await result.current.createAccount();
      expect(created).toBeNull();
    });
    expect(result.current.actionError?.code).toBe('CREATE_FAIL');

    await act(async () => {
      const freezeSuccess = await result.current.freezeAccount('a1');
      expect(freezeSuccess).toBe(false);
    });
    expect(result.current.actionError?.code).toBe('FREEZE_FAIL');

    await act(async () => {
      const unfreezeSuccess = await result.current.unfreezeAccount('a1');
      expect(unfreezeSuccess).toBe(false);
    });
    expect(result.current.actionError?.code).toBe('UNFREEZE_FAIL');

    await act(async () => {
      await result.current.selectAccount('a1');
    });
    expect(result.current.actionError?.code).toBe('BALANCE_FAIL');

    await act(async () => {
      await result.current.fetchAccounts();
    });
    expect(result.current.error?.message).toBe('Error al consultar cuentas');

    await act(async () => {
      await result.current.createAccount();
    });
    expect(result.current.actionError?.message).toBe('Error al crear la cuenta');

    await act(async () => {
      await result.current.freezeAccount('a1');
    });
    expect(result.current.actionError?.message).toBe('Error al congelar la cuenta');

    await act(async () => {
      await result.current.unfreezeAccount('a1');
    });
    expect(result.current.actionError?.message).toBe('Error al descongelar la cuenta');

    await act(async () => {
      await result.current.selectAccount('a1');
    });
    expect(result.current.actionError?.message).toBe('Error al consultar detalle de cuenta');

    await act(async () => {
      result.current.retry();
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(result.current.status).toBe('error');
  });

  it('freezeAccount y unfreezeAccount actualizan selectedAccount si la cuenta seleccionada es modificada', async () => {
    const myAccount = { id: 'a-selected', accountNumber: 'ACC-1', balance: 100, status: 'ACTIVE' as const, userId: 'user-me' };
    const updatedAccount = { ...myAccount, status: 'FROZEN' as const };

    vi.spyOn(di.getUserAccountsUseCase, 'execute').mockResolvedValue([myAccount]);
    vi.spyOn(di.freezeAccountUseCase, 'execute').mockResolvedValue(undefined);
    vi.spyOn(di.unfreezeAccountUseCase, 'execute').mockResolvedValue(undefined);
    vi.spyOn(di.getBalanceUseCase, 'execute').mockResolvedValueOnce(myAccount).mockResolvedValueOnce(updatedAccount).mockResolvedValueOnce(myAccount);
    vi.spyOn(di.getTransactionHistoryUseCase, 'execute').mockResolvedValue({ accountId: 'a-selected', transactions: [] });

    const mockSession = { token: 'jwt', user: { id: 'user-me', name: 'Me', email: 'me@test.com' } };
    vi.spyOn(di.loginUserUseCase, 'execute').mockResolvedValue(mockSession);

    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(
      () => ({ auth: useAuth(), account: useAccount() }),
      { wrapper }
    );

    await act(async () => {
      await result.current.auth.login({ email: 'me@test.com', password: 'pass' });
    });

    await act(async () => {
      await result.current.account.fetchAccounts();
    });

    await act(async () => {
      await result.current.account.selectAccount('a-selected');
    });

    expect(result.current.account.selectedAccount?.id).toBe('a-selected');

    await act(async () => {
      await result.current.account.freezeAccount('a-selected');
    });
    expect(result.current.account.selectedAccount?.status).toBe('FROZEN');

    await act(async () => {
      await result.current.account.unfreezeAccount('a-selected');
    });
    expect(result.current.account.selectedAccount?.status).toBe('ACTIVE');
  });

  it('selectAccount rechaza cuentas ajenas con error 403 y unfreezeAccount rechaza ajenas con 403', async () => {
    const otherAccount = { id: 'a-other', accountNumber: 'ACC-99', balance: 50, status: 'ACTIVE' as const, userId: 'user-other' };
    vi.spyOn(di.getUserAccountsUseCase, 'execute').mockResolvedValue([otherAccount]);

    const mockSession = { token: 'jwt', user: { id: 'user-me', name: 'Me', email: 'me@test.com' } };
    vi.spyOn(di.loginUserUseCase, 'execute').mockResolvedValue(mockSession);

    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(
      () => ({ auth: useAuth(), account: useAccount() }),
      { wrapper }
    );

    await act(async () => {
      await result.current.auth.login({ email: 'me@test.com', password: 'pass' });
    });

    await act(async () => {
      await result.current.account.fetchAccounts();
    });

    await act(async () => {
      await result.current.account.selectAccount('a-other');
    });
    expect(result.current.account.actionError?.httpStatus).toBe(403);

    await act(async () => {
      const success = await result.current.account.unfreezeAccount('a-other');
      expect(success).toBe(false);
    });
    expect(result.current.account.actionError?.httpStatus).toBe(403);
  });
});
