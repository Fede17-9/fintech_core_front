import { describe, it, expect, vi } from 'vitest';
import { UnfreezeAccountUseCase } from '../../../src/application/account/UnfreezeAccountUseCase';
import { AccountRepository } from '../../../src/domain/repositories/AccountRepository';

describe('UnfreezeAccountUseCase', () => {
  it('ejecuta la descongelación de cuenta a través del repositorio', async () => {
    const mockRepo: AccountRepository = {
      getAccounts: vi.fn(),
      createAccount: vi.fn(),
      getBalance: vi.fn(),
      freezeAccount: vi.fn(),
      unfreezeAccount: vi.fn().mockResolvedValue(undefined),
    };

    const useCase = new UnfreezeAccountUseCase(mockRepo);
    await useCase.execute('acc-100');

    expect(mockRepo.unfreezeAccount).toHaveBeenCalledWith('acc-100');
  });
});
