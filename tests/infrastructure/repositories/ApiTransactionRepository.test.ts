import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiTransactionRepository } from '../../../src/infrastructure/repositories/ApiTransactionRepository';
import { apiClient } from '../../../src/infrastructure/http/ApiClient';

describe('ApiTransactionRepository', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deposit, withdraw, transfer y getHistory ejecutan correctamente invocando apiClient', async () => {
    const mockPost = vi.spyOn(apiClient, 'post')
      .mockResolvedValueOnce({ accountId: 'acc-1', newBalance: 1500, depositedAt: '2026-09-19T00:00:00Z' })
      .mockResolvedValueOnce({ accountId: 'acc-1', newBalance: 1300, withdrawnAt: '2026-09-19T00:00:00Z' })
      .mockResolvedValueOnce({
        transactionId: 'tx-100',
        sourceAccountId: 'acc-1',
        destinationAccountId: 'acc-2',
        amount: 200,
        executedAt: '2026-09-19T00:00:00Z',
      });

    const mockGet = vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      accountId: 'acc-1',
      transactions: [
        { id: 'tx-100', type: 'TRANSFER', amount: 200, status: 'COMPLETED', createdAt: '2026-09-19T00:00:00Z' },
      ],
    });

    const txRepo = new ApiTransactionRepository();

    const dep = await txRepo.deposit({ accountId: 'acc-1', amount: 500 });
    expect(dep.newBalance).toBe(1500);

    const wd = await txRepo.withdraw({ accountId: 'acc-1', amount: 200 });
    expect(wd.newBalance).toBe(1300);

    const tr = await txRepo.transfer({ sourceAccountId: 'acc-1', destinationAccountId: 'acc-2', amount: 200 });
    expect(tr.id).toBe('tx-100');

    const hist = await txRepo.getHistory('acc-1');
    expect(hist.transactions).toHaveLength(1);
    expect(mockPost).toHaveBeenCalledTimes(3);
    expect(mockGet).toHaveBeenCalledWith('/api/transactions/history/acc-1');
  });
});
