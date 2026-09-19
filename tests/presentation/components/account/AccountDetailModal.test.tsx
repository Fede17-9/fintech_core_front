import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AccountDetailModal } from '../../../../src/presentation/components/account/AccountDetailModal';
import { Account } from '../../../../src/domain/entities/Account';
import { TransactionHistory } from '../../../../src/domain/entities/Transaction';

describe('AccountDetailModal', () => {
  const mockAccountActive: Account = {
    id: 'acc-1',
    userId: 'user-1',
    accountNumber: 'ACC-1001',
    balance: 5000,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  };

  it('retorna null si account es null', () => {
    const { container } = render(
      <AccountDetailModal account={null} history={null} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza detalles de cuenta e historial cuando existe', () => {
    const mockHistory: TransactionHistory = {
      accountId: 'acc-1',
      transactions: [
        {
          id: 'tx-1',
          type: 'DEPOSIT',
          amount: 100,
          status: 'COMPLETED',
          createdAt: '2026-01-01'
        },
      ],
    };

    const onClose = vi.fn();

    render(
      <AccountDetailModal
        account={mockAccountActive}
        history={mockHistory}
        onClose={onClose}
      />
    );

    expect(screen.getByText('Detalle de Cuenta')).toBeDefined();
    expect(screen.getByText('ACC-1001')).toBeDefined();
    expect(screen.getByText('DEPOSIT')).toBeDefined();
    expect(screen.getByText('$100.00')).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('muestra mensaje cuando no hay transacciones en el historial', () => {
    render(
      <AccountDetailModal
        account={mockAccountActive}
        history={{ accountId: 'acc-1', transactions: [] }}
        onClose={vi.fn()}
      />
    );

    expect(
      screen.getByText('No se registran transacciones para esta cuenta.')
    ).toBeDefined();
  });
});
