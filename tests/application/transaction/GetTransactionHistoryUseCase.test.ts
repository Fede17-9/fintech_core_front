import { describe, it, expect, vi } from 'vitest';
import { GetTransactionHistoryUseCase } from '../../../src/application/transaction/GetTransactionHistoryUseCase';
import { TransactionRepository } from '../../../src/domain/repositories/TransactionRepository';

describe('GetTransactionHistoryUseCase', () => {
  it('obtiene el historial de transacciones', async () => {
    const mockRepo: TransactionRepository = {
      deposit: vi.fn(),
      withdraw: vi.fn(),
      transfer: vi.fn(),
      getHistory: vi.fn(),
    };

    const historyResult = {
      accountId: 'acc-1',
      transactions: [
        {
          id: 'tx-1',
          type: 'DEPOSIT' as const,
          amount: 500,
          status: 'COMPLETED' as const,
          createdAt: '2026-09-19T00:00:00Z',
        },
      ],
    };
    vi.mocked(mockRepo.getHistory).mockResolvedValue(historyResult);

    const useCase = new GetTransactionHistoryUseCase(mockRepo);
    const result = await useCase.execute('acc-1');

    expect(result).toEqual(historyResult);
    expect(mockRepo.getHistory).toHaveBeenCalledWith('acc-1');
  });
});
