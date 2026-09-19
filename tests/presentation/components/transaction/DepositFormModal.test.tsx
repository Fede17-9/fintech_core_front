import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DepositFormModal } from '../../../../src/presentation/components/transaction/DepositFormModal';
import { Account } from '../../../../src/domain/entities/Account';

describe('DepositFormModal', () => {
  const validAccId1 = '123e4567-e89b-12d3-a456-426614174000';
  const validAccId2 = '987fc543-e89b-12d3-a456-426614174999';

  const mockAccounts: Account[] = [
    {
      id: validAccId1,
      userId: 'user-1',
      accountNumber: 'ACC-001',
      balance: 1000,
      status: 'ACTIVE',
      createdAt: '2026-01-01'
    },
    {
      id: validAccId2,
      userId: 'user-1',
      accountNumber: 'ACC-002',
      balance: 500,
      status: 'ACTIVE',
      createdAt: '2026-01-01'
    },
  ];

  it('retorna null cuando isOpen es false', () => {
    const { container } = render(
      <DepositFormModal
        accounts={mockAccounts}
        isOpen={false}
        isLoading={false}
        error={null}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('valida monto no válido y muestra error', async () => {
    render(
      <DepositFormModal
        accounts={mockAccounts}
        isOpen={true}
        isLoading={false}
        error={null}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Depósito' }));
    const errorEl = await screen.findByText('El monto a depositar debe ser un número estrictamente mayor a cero');
    expect(errorEl).toBeDefined();
  });

  it('envía datos de depósito válidos', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <DepositFormModal
        accounts={mockAccounts}
        defaultAccountId={validAccId1}
        isOpen={true}
        isLoading={false}
        error={null}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    const input = screen.getByLabelText('Monto a Depositar');
    fireEvent.change(input, { target: { value: '150' } });

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Depósito' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        accountId: validAccId1,
        amount: 150,
      });
    });
  });
});
