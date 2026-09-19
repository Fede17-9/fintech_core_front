import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AccountList } from '../../../../src/presentation/components/account/AccountList';
import { Account } from '../../../../src/domain/entities/Account';

describe('AccountList', () => {
  const mockAccountActive: Account = {
    id: 'acc-1',
    userId: 'user-1',
    accountNumber: 'ACC-1001',
    balance: 5000,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  };

  const mockAccountFrozen: Account = {
    id: 'acc-2',
    userId: 'user-1',
    accountNumber: 'ACC-1002',
    balance: 2000,
    status: 'FROZEN',
    createdAt: '2026-01-01'
  };

  it('renderiza la lista de tarjetas de cuenta', () => {
    render(
      <AccountList
        accounts={[mockAccountActive, mockAccountFrozen]}
        currentUserId="user-1"
        isActionLoading={false}
        onSelectAccount={vi.fn()}
        onFreezeAccount={vi.fn()}
        onUnfreezeAccount={vi.fn()}
      />
    );

    expect(screen.getByText('ACC-1001')).toBeDefined();
    expect(screen.getByText('ACC-1002')).toBeDefined();
  });
});
