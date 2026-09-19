import { describe, it, expect } from 'vitest';
import { TransactionMapper } from '../../../src/infrastructure/mappers/TransactionMapper';

describe('TransactionMapper', () => {
  it('mapea TransactionHistoryItemDTO a TransactionRecord domain', () => {
    const dto = {
      id: 'tx-1',
      type: 'DEPOSIT' as const,
      amount: 100,
      status: 'COMPLETED' as const,
      createdAt: '2026-09-19T00:00:00Z',
    };
    const record = TransactionMapper.toRecordDomain(dto);
    expect(record.id).toBe('tx-1');
    expect(record.amount).toBe(100);
    expect(record.type).toBe('DEPOSIT');
  });

  it('mapea TransactionHistoryResponseDTO a TransactionHistory domain', () => {
    const dto = {
      accountId: 'acc-1',
      transactions: [
        {
          id: 'tx-1',
          type: 'WITHDRAWAL' as const,
          amount: 50,
          status: 'COMPLETED' as const,
          createdAt: '2026-09-19T00:00:00Z',
        },
      ],
    };
    const history = TransactionMapper.toHistoryDomain(dto);
    expect(history.accountId).toBe('acc-1');
    expect(history.transactions).toHaveLength(1);
    expect(history.transactions[0].amount).toBe(50);
  });

  it('mapea TransferResponseDataDTO a TransactionRecord domain', () => {
    const dto = {
      transactionId: 'tx-99',
      sourceAccountId: 'acc-1',
      destinationAccountId: 'acc-2',
      amount: 300,
      executedAt: '2026-09-19T10:00:00Z',
    };
    const record = TransactionMapper.transferDtoToRecord(dto);
    expect(record.id).toBe('tx-99');
    expect(record.type).toBe('TRANSFER');
    expect(record.status).toBe('COMPLETED');
    expect(record.sourceAccountId).toBe('acc-1');
    expect(record.destinationAccountId).toBe('acc-2');
  });
});
