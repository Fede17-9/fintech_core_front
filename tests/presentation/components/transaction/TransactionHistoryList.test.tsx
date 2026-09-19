import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TransactionHistoryList } from '../../../../src/presentation/components/transaction/TransactionHistoryList';
import { TransactionRecord } from '../../../../src/domain/entities/Transaction';

describe('TransactionHistoryList', () => {
  const validAccId1 = '123e4567-e89b-12d3-a456-426614174000';

  it('muestra mensaje cuando la lista de transacciones está vacía', () => {
    render(<TransactionHistoryList transactions={[]} />);
    expect(screen.getByText('No hay transacciones registradas.')).toBeDefined();
  });

  it('renderiza tarjetas de transacciones con insignias y descripciones', () => {
    const mockTxs: TransactionRecord[] = [
      {
        id: 'tx-100',
        destinationAccountId: validAccId1,
        type: 'DEPOSIT',
        amount: 500,
        status: 'COMPLETED',
        description: 'Depósito inicial',
        createdAt: '2026-01-01',
      },
      {
        id: 'tx-101',
        sourceAccountId: validAccId1,
        type: 'WITHDRAWAL',
        amount: 100,
        status: 'COMPLETED',
        createdAt: '2026-01-02',
      },
    ];

    render(<TransactionHistoryList transactions={mockTxs} />);

    expect(screen.getByText('DEPOSIT')).toBeDefined();
    expect(screen.getByText('WITHDRAWAL')).toBeDefined();
    expect(screen.getByText('Depósito inicial')).toBeDefined();
  });
});
