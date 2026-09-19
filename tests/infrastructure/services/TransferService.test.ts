import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransferService } from '../../../src/infrastructure/services/TransferService';
import { apiClient } from '../../../src/infrastructure/http/ApiClient';

describe('TransferService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('TransferService.transfer llama a apiClient.post con la ruta correcta', async () => {
    const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({
      transactionId: 'tx-1',
      sourceAccountId: 'acc-1',
      destinationAccountId: 'acc-2',
      amount: 50,
      executedAt: '2026-09-19T00:00:00Z',
    });

    const res = await TransferService.transfer({
      sourceAccountId: 'acc-1',
      destinationAccountId: 'acc-2',
      amount: 50,
    });

    expect(res.transactionId).toBe('tx-1');
    expect(mockPost).toHaveBeenCalledWith('/api/transactions/transfer', {
      sourceAccountId: 'acc-1',
      destinationAccountId: 'acc-2',
      amount: 50,
    });
  });
});
