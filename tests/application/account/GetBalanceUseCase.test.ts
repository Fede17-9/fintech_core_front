import { describe, it, expect, vi } from 'vitest';
import { GetBalanceUseCase } from '../../../src/application/account/GetBalanceUseCase';
import { AccountRepository } from '../../../src/domain/repositories/AccountRepository';
import { Account } from '../../../src/domain/entities/Account';

describe('GetBalanceUseCase', () => {
  it('obtiene el balance de una cuenta específica', async () => {
    const mockRepo: AccountRepository = {
      getAccounts: vi.fn(),
      createAccount: vi.fn(),
      getBalance: vi.fn(),
      freezeAccount: vi.fn(),
      unfreezeAccount: vi.fn(),
    };

    const mockAccount: Account = { id: 'a1', accountNumber: 'ACC-1', balance: 1000, status: 'ACTIVE', userId: 'u1' };
    vi.mocked(mockRepo.getBalance).mockResolvedValue(mockAccount);

    const useCase = new GetBalanceUseCase(mockRepo);
    const result = await useCase.execute('a1');

    expect(result).toEqual(mockAccount);
    expect(mockRepo.getBalance).toHaveBeenCalledWith('a1');
  });
});
