import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WithdrawFormModal } from '../../../../src/presentation/components/transaction/WithdrawFormModal';
import { Account } from '../../../../src/domain/entities/Account';

describe('WithdrawFormModal', () => {
  const validAccId1 = '123e4567-e89b-12d3-a456-426614174000';

  const mockAccounts: Account[] = [
    {
      id: validAccId1,
      userId: 'user-1',
      accountNumber: 'ACC-001',
      balance: 1000,
      status: 'ACTIVE',
      createdAt: '2026-01-01'
    },
  ];

  it('retorna null cuando isOpen es false', () => {
    const { container } = render(
      <WithdrawFormModal
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

  it('muestra error de validación cuando el monto de retiro es inválido', async () => {
    render(
      <WithdrawFormModal
        accounts={mockAccounts}
        isOpen={true}
        isLoading={false}
        error={null}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Retiro' }));
    const errorEl = await screen.findByText('El monto a retirar debe ser un número estrictamente mayor a cero');
    expect(errorEl).toBeDefined();
  });

  it('envía datos de retiro válidos', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <WithdrawFormModal
        accounts={mockAccounts}
        defaultAccountId={validAccId1}
        isOpen={true}
        isLoading={false}
        error={null}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    const input = screen.getByLabelText('Monto a Retirar');
    fireEvent.change(input, { target: { value: '50' } });

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Retiro' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        accountId: validAccId1,
        amount: 50,
      });
    });
  });
});
