import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AccountCard } from '../../../../src/presentation/components/account/AccountCard';
import { Account } from '../../../../src/domain/entities/Account';

describe('AccountCard', () => {
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

  it('muestra información de cuenta activa y responde al click de selección', () => {
    const onSelect = vi.fn();
    render(
      <AccountCard
        account={mockAccountActive}
        isOwner={true}
        isActionLoading={false}
        onSelect={onSelect}
        onFreeze={vi.fn()}
        onUnfreeze={vi.fn()}
      />
    );

    expect(screen.getByText('ACC-1001')).toBeDefined();
    expect(screen.getByText('ACTIVA')).toBeDefined();

    fireEvent.click(screen.getByText('ACC-1001'));
    expect(onSelect).toHaveBeenCalledWith('acc-1');
  });

  it('muestra la insignia CONGELADA para cuenta congelada', () => {
    const onUnfreeze = vi.fn();
    render(
      <AccountCard
        account={mockAccountFrozen}
        isOwner={true}
        isActionLoading={false}
        onSelect={vi.fn()}
        onFreeze={vi.fn()}
        onUnfreeze={onUnfreeze}
      />
    );

    expect(screen.getByText('ACC-1002')).toBeDefined();
    expect(screen.getByText('CONGELADA')).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: 'Descongelar' }));
    expect(onUnfreeze).toHaveBeenCalledWith('acc-2');
  });

  it('ejecuta onFreeze al presionar congelar en cuenta activa', () => {
    const onFreeze = vi.fn();
    render(
      <AccountCard
        account={mockAccountActive}
        isOwner={true}
        isActionLoading={false}
        onSelect={vi.fn()}
        onFreeze={onFreeze}
        onUnfreeze={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Congelar' }));
    expect(onFreeze).toHaveBeenCalledWith('acc-1');
  });
});
