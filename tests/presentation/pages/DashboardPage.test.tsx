import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from '../../../src/presentation/pages/DashboardPage';
import * as useAuthModule from '../../../src/presentation/hooks/useAuth';
import * as useAccountModule from '../../../src/presentation/hooks/useAccount';
import * as useTransactionModule from '../../../src/presentation/hooks/useTransaction';

vi.mock('../../../src/presentation/hooks/useAuth');
vi.mock('../../../src/presentation/hooks/useAccount');
vi.mock('../../../src/presentation/hooks/useTransaction');

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      status: 'authenticated',
      session: {
        token: 'token-xyz',
        user: { id: 'usr-1', email: 'dashboard@test.com', name: 'Usuario Dashboard' },
      },
      error: null,
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    vi.spyOn(useTransactionModule, 'useTransaction').mockReturnValue({
      status: 'idle',
      error: null,
      isLoading: false,
      lastResult: null,
      deposit: vi.fn(),
      withdraw: vi.fn(),
      transfer: vi.fn(),
      clearState: vi.fn(),
    });
  });

  it('renderiza spinner cuando accountStatus es loading', () => {
    vi.spyOn(useAccountModule, 'useAccount').mockReturnValue({
      accounts: [],
      selectedAccount: null,
      history: null,
      status: 'loading',
      error: null,
      actionLoading: false,
      actionError: null,
      fetchAccounts: vi.fn(),
      createAccount: vi.fn(),
      freezeAccount: vi.fn(),
      unfreezeAccount: vi.fn(),
      selectAccount: vi.fn(),
      closeAccountDetail: vi.fn(),
      retry: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando tus cuentas bancarias...')).toBeDefined();
  });

  it('renderiza estado de error con botón de reintento cuando accountStatus es error', () => {
    const mockRetry = vi.fn();
    vi.spyOn(useAccountModule, 'useAccount').mockReturnValue({
      accounts: [],
      selectedAccount: null,
      history: null,
      status: 'error',
      error: { name: 'ApiError', message: 'Fallo al cargar cuentas', httpStatus: 500, code: 'SERVER_ERROR' },
      actionLoading: false,
      actionError: null,
      fetchAccounts: vi.fn(),
      createAccount: vi.fn(),
      freezeAccount: vi.fn(),
      unfreezeAccount: vi.fn(),
      selectAccount: vi.fn(),
      closeAccountDetail: vi.fn(),
      retry: mockRetry,
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Fallo al cargar cuentas')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar Consulta' }));
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('renderiza estado vacío cuando accountStatus es empty', () => {
    const mockCreateAccount = vi.fn();
    vi.spyOn(useAccountModule, 'useAccount').mockReturnValue({
      accounts: [],
      selectedAccount: null,
      history: null,
      status: 'empty',
      error: null,
      actionLoading: false,
      actionError: null,
      fetchAccounts: vi.fn(),
      createAccount: mockCreateAccount,
      freezeAccount: vi.fn(),
      unfreezeAccount: vi.fn(),
      selectAccount: vi.fn(),
      closeAccountDetail: vi.fn(),
      retry: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Aún no tienes cuentas creadas')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Crear mi primera cuenta' }));
    expect(mockCreateAccount).toHaveBeenCalledTimes(1);
  });

  it('renderiza resumen y cuentas cuando accountStatus es success', () => {
    vi.spyOn(useAccountModule, 'useAccount').mockReturnValue({
      accounts: [
        {
          id: 'acc-1',
          userId: 'usr-1',
          accountNumber: 'ACC-500',
          balance: 1500,
          status: 'ACTIVE',
          createdAt: '2026-01-01'
        },
      ],
      selectedAccount: null,
      history: null,
      status: 'success',
      error: null,
      actionLoading: false,
      actionError: null,
      fetchAccounts: vi.fn(),
      createAccount: vi.fn(),
      freezeAccount: vi.fn(),
      unfreezeAccount: vi.fn(),
      selectAccount: vi.fn(),
      closeAccountDetail: vi.fn(),
      retry: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Panel Principal')).toBeDefined();
    expect(screen.getByText('ACC-500')).toBeDefined();
  });

  it('abre modal de depósito al presionar botón Depósito y procesa el envío', async () => {
    const mockDeposit = vi.fn().mockResolvedValue({ id: 'tx-1' });
    const mockFetchAccounts = vi.fn().mockResolvedValue(undefined);

    vi.spyOn(useTransactionModule, 'useTransaction').mockReturnValue({
      status: 'idle',
      error: null,
      isLoading: false,
      lastResult: null,
      deposit: mockDeposit,
      withdraw: vi.fn(),
      transfer: vi.fn(),
      clearState: vi.fn(),
    });

    vi.spyOn(useAccountModule, 'useAccount').mockReturnValue({
      accounts: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: 'usr-1',
          accountNumber: 'ACC-500',
          balance: 1500,
          status: 'ACTIVE',
          createdAt: '2026-01-01'
        },
      ],
      selectedAccount: null,
      history: null,
      status: 'success',
      error: null,
      actionLoading: false,
      actionError: null,
      fetchAccounts: mockFetchAccounts,
      createAccount: vi.fn(),
      freezeAccount: vi.fn(),
      unfreezeAccount: vi.fn(),
      selectAccount: vi.fn(),
      closeAccountDetail: vi.fn(),
      retry: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Depósito' }));

    expect(screen.getByText('Realizar Depósito')).toBeDefined();

    const input = screen.getByLabelText('Monto a Depositar');
    fireEvent.change(input, { target: { value: '100' } });

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Depósito' }));

    await waitFor(() => {
      expect(mockDeposit).toHaveBeenCalledWith({
        accountId: '123e4567-e89b-12d3-a456-426614174000',
        amount: 100,
      });
      expect(mockFetchAccounts).toHaveBeenCalled();
    });
  });

  it('abre modal de retiro al presionar botón Retiro y procesa el envío', async () => {
    const mockWithdraw = vi.fn().mockResolvedValue({ id: 'tx-2' });
    const mockFetchAccounts = vi.fn().mockResolvedValue(undefined);

    vi.spyOn(useTransactionModule, 'useTransaction').mockReturnValue({
      status: 'idle',
      error: null,
      isLoading: false,
      lastResult: null,
      deposit: vi.fn(),
      withdraw: mockWithdraw,
      transfer: vi.fn(),
      clearState: vi.fn(),
    });

    vi.spyOn(useAccountModule, 'useAccount').mockReturnValue({
      accounts: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: 'usr-1',
          accountNumber: 'ACC-500',
          balance: 1500,
          status: 'ACTIVE',
          createdAt: '2026-01-01'
        },
      ],
      selectedAccount: null,
      history: null,
      status: 'success',
      error: null,
      actionLoading: false,
      actionError: null,
      fetchAccounts: mockFetchAccounts,
      createAccount: vi.fn(),
      freezeAccount: vi.fn(),
      unfreezeAccount: vi.fn(),
      selectAccount: vi.fn(),
      closeAccountDetail: vi.fn(),
      retry: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Retiro' }));

    expect(screen.getByText('Realizar Retiro')).toBeDefined();

    const input = screen.getByLabelText('Monto a Retirar');
    fireEvent.change(input, { target: { value: '50' } });

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Retiro' }));

    await waitFor(() => {
      expect(mockWithdraw).toHaveBeenCalledWith({
        accountId: '123e4567-e89b-12d3-a456-426614174000',
        amount: 50,
      });
      expect(mockFetchAccounts).toHaveBeenCalled();
    });
  });

  it('abre modal de transferencia al presionar botón Transferencia y procesa el envío', async () => {
    const mockTransfer = vi.fn().mockResolvedValue({ id: 'tx-3' });
    const mockFetchAccounts = vi.fn().mockResolvedValue(undefined);

    vi.spyOn(useTransactionModule, 'useTransaction').mockReturnValue({
      status: 'idle',
      error: null,
      isLoading: false,
      lastResult: null,
      deposit: vi.fn(),
      withdraw: vi.fn(),
      transfer: mockTransfer,
      clearState: vi.fn(),
    });

    vi.spyOn(useAccountModule, 'useAccount').mockReturnValue({
      accounts: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: 'usr-1',
          accountNumber: 'ACC-500',
          balance: 1500,
          status: 'ACTIVE',
          createdAt: '2026-01-01'
        },
      ],
      selectedAccount: null,
      history: null,
      status: 'success',
      error: null,
      actionLoading: false,
      actionError: null,
      fetchAccounts: mockFetchAccounts,
      createAccount: vi.fn(),
      freezeAccount: vi.fn(),
      unfreezeAccount: vi.fn(),
      selectAccount: vi.fn(),
      closeAccountDetail: vi.fn(),
      retry: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    const transferBtns = screen.getAllByRole('button', { name: 'Transferencia' });
    fireEvent.click(transferBtns[0]!);

    expect(screen.getByText('Transferencia de Fondos')).toBeDefined();

    const destInput = screen.getByLabelText('Cuenta de Destino (ID / UUID)');
    fireEvent.change(destInput, { target: { value: '987fc543-e89b-12d3-a456-426614174999' } });

    const amountInput = screen.getByLabelText('Monto a Transferir');
    fireEvent.change(amountInput, { target: { value: '200' } });

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Transferencia' }));

    await waitFor(() => {
      expect(mockTransfer).toHaveBeenCalledWith({
        sourceAccountId: '123e4567-e89b-12d3-a456-426614174000',
        destinationAccountId: '987fc543-e89b-12d3-a456-426614174999',
        amount: 200,
        description: undefined,
      });
      expect(mockFetchAccounts).toHaveBeenCalled();
    });
  });
});
