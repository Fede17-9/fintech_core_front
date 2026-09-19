import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionService } from '../../../src/infrastructure/services/TransactionService';
import { apiClient } from '../../../src/infrastructure/http/ApiClient';

describe('TransactionService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('TransactionService invoca deposit, withdraw y getHistory en apiClient', async () => {
    const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({ accountId: 'acc-1', newBalance: 500 });
    const mockGet = vi.spyOn(apiClient, 'get').mockResolvedValue({ accountId: 'acc-1', transactions: [] });

    await TransactionService.deposit({ accountId: 'acc-1', amount: 100 });
    await TransactionService.withdraw({ accountId: 'acc-1', amount: 50 });
    await TransactionService.getHistory('acc-1');

    expect(mockPost).toHaveBeenCalledTimes(2);
    expect(mockGet).toHaveBeenCalledWith('/api/transactions/history/acc-1');
  });
});
