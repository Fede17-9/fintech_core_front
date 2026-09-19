import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AccountSummaryCard } from '../../../../src/presentation/components/account/AccountSummaryCard';
import { Account } from '../../../../src/domain/entities/Account';

describe('AccountSummaryCard', () => {
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

  it('calcula y muestra las estadísticas totales y balance activo', () => {
    render(<AccountSummaryCard accounts={[mockAccountActive, mockAccountFrozen]} />);

    expect(screen.getByText('Saldo Total Activo')).toBeDefined();
    expect(screen.getByText('Cuentas Totales')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getAllByText('1')).toHaveLength(2);
  });
});
