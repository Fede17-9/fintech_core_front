import { describe, it, expect, vi } from 'vitest';
import { CreateAccountUseCase } from '../../../src/application/account/CreateAccountUseCase';
import { AccountRepository } from '../../../src/domain/repositories/AccountRepository';
import { Account } from '../../../src/domain/entities/Account';

describe('CreateAccountUseCase', () => {
  it('solicita creación de cuenta al repositorio', async () => {
    const mockRepo: AccountRepository = {
      getAccounts: vi.fn(),
      createAccount: vi.fn(),
      getBalance: vi.fn(),
      freezeAccount: vi.fn(),
      unfreezeAccount: vi.fn(),
    };

    const newAcc: Account = { id: 'a2', accountNumber: 'ACC-2', balance: 0, status: 'ACTIVE', userId: 'u1' };
    vi.mocked(mockRepo.createAccount).mockResolvedValue(newAcc);

    const useCase = new CreateAccountUseCase(mockRepo);
    const result = await useCase.execute();

    expect(result).toEqual(newAcc);
    expect(mockRepo.createAccount).toHaveBeenCalledTimes(1);
  });
});
