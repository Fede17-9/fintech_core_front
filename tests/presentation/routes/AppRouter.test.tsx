import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppRouter } from '../../../src/presentation/routes/AppRouter';
import * as useAuthModule from '../../../src/presentation/hooks/useAuth';

vi.mock('../../../src/presentation/hooks/useAuth');
vi.mock('../../../src/presentation/hooks/useAccount', () => ({
  useAccount: () => ({
    accounts: [],
    selectedAccount: null,
    history: null,
    status: 'empty',
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
  }),
}));
vi.mock('../../../src/presentation/hooks/useTransaction', () => ({
  useTransaction: () => ({
    status: 'idle',
    transaction: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    deposit: vi.fn(),
    withdraw: vi.fn(),
    transfer: vi.fn(),
    clearState: vi.fn(),
  }),
}));

describe('AppRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza la estructura principal con BrowserRouter', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      status: 'anonymous',
      session: null,
      error: null,
      isLoading: false,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    render(<AppRouter />);

    expect(screen.getByText('Fintech Core')).toBeDefined();
  });
});
