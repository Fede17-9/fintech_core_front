import { describe, it, expect, vi } from 'vitest';
import { WithdrawUseCase } from '../../../src/application/transaction/WithdrawUseCase';
import { TransactionRepository } from '../../../src/domain/repositories/TransactionRepository';

describe('WithdrawUseCase', () => {
  it('ejecuta el retiro a través del repositorio', async () => {
    const mockRepo: TransactionRepository = {
      deposit: vi.fn(),
      withdraw: vi.fn(),
      transfer: vi.fn(),
      getHistory: vi.fn(),
    };

    const withdrawResult = { accountId: 'acc-1', newBalance: 1000, withdrawnAt: '2026-09-19T00:00:00Z' };
    vi.mocked(mockRepo.withdraw).mockResolvedValue(withdrawResult);

    const useCase = new WithdrawUseCase(mockRepo);
    const result = await useCase.execute({ accountId: 'acc-1', amount: 200 });

    expect(result).toEqual(withdrawResult);
    expect(mockRepo.withdraw).toHaveBeenCalledWith({ accountId: 'acc-1', amount: 200 });
  });
});
