import { describe, it, expect, vi } from 'vitest';
import { GetUserAccountsUseCase } from '../../../src/application/account/GetUserAccountsUseCase';
import { AccountRepository } from '../../../src/domain/repositories/AccountRepository';
import { Account } from '../../../src/domain/entities/Account';

describe('GetUserAccountsUseCase', () => {
  it('obtiene el listado de cuentas del usuario', async () => {
    const mockRepo: AccountRepository = {
      getAccounts: vi.fn(),
      createAccount: vi.fn(),
      getBalance: vi.fn(),
      freezeAccount: vi.fn(),
      unfreezeAccount: vi.fn(),
    };

    const mockAccounts: Account[] = [
      { id: 'a1', accountNumber: 'ACC-1', balance: 500, status: 'ACTIVE', userId: 'u1' },
    ];
    vi.mocked(mockRepo.getAccounts).mockResolvedValue(mockAccounts);

    const useCase = new GetUserAccountsUseCase(mockRepo);
    const result = await useCase.execute();

    expect(result).toEqual(mockAccounts);
    expect(mockRepo.getAccounts).toHaveBeenCalledTimes(1);
  });
});
