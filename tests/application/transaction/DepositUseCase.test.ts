import { describe, it, expect, vi } from 'vitest';
import { DepositUseCase } from '../../../src/application/transaction/DepositUseCase';
import { TransactionRepository } from '../../../src/domain/repositories/TransactionRepository';

describe('DepositUseCase', () => {
  it('envía el DTO de depósito y retorna resultado', async () => {
    const mockRepo: TransactionRepository = {
      deposit: vi.fn(),
      withdraw: vi.fn(),
      transfer: vi.fn(),
      getHistory: vi.fn(),
    };

    const depositResult = { accountId: 'acc-1', newBalance: 1500, depositedAt: '2026-09-19T00:00:00Z' };
    vi.mocked(mockRepo.deposit).mockResolvedValue(depositResult);

    const useCase = new DepositUseCase(mockRepo);
    const result = await useCase.execute({ accountId: 'acc-1', amount: 500 });

    expect(result).toEqual(depositResult);
    expect(mockRepo.deposit).toHaveBeenCalledWith({ accountId: 'acc-1', amount: 500 });
  });
});
