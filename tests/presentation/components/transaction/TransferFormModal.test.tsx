import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TransferFormModal } from '../../../../src/presentation/components/transaction/TransferFormModal';
import { Account } from '../../../../src/domain/entities/Account';

describe('TransferFormModal', () => {
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
      <TransferFormModal
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

  it('muestra error de validación cuando el ID de destino es inválido', async () => {
    render(
      <TransferFormModal
        accounts={mockAccounts}
        isOpen={true}
        isLoading={false}
        error={null}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const destInput = screen.getByLabelText('Cuenta de Destino (ID / UUID)');
    fireEvent.change(destInput, { target: { value: 'invalid-id' } });

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Transferencia' }));
    const errorEl = await screen.findByText('ID de cuenta de destino debe ser un UUID válido');
    expect(errorEl).toBeDefined();
  });

  it('envía datos de transferencia válidos', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <TransferFormModal
        accounts={mockAccounts}
        defaultSourceAccountId={validAccId1}
        isOpen={true}
        isLoading={false}
        error={null}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    const destInput = screen.getByLabelText('Cuenta de Destino (ID / UUID)');
    fireEvent.change(destInput, { target: { value: validAccId2 } });

    const amountInput = screen.getByLabelText('Monto a Transferir');
    fireEvent.change(amountInput, { target: { value: '200' } });

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Transferencia' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        sourceAccountId: validAccId1,
        destinationAccountId: validAccId2,
        amount: 200,
        description: undefined,
      });
    });
  });
});
