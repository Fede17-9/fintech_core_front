import { describe, it, expect, vi } from 'vitest';
import { FreezeAccountUseCase } from '../../../src/application/account/FreezeAccountUseCase';
import { AccountRepository } from '../../../src/domain/repositories/AccountRepository';

describe('FreezeAccountUseCase', () => {
  it('ejecuta la congelación de cuenta a través del repositorio', async () => {
    const mockRepo: AccountRepository = {
      getAccounts: vi.fn(),
      createAccount: vi.fn(),
      getBalance: vi.fn(),
      freezeAccount: vi.fn().mockResolvedValue(undefined),
      unfreezeAccount: vi.fn(),
    };

    const useCase = new FreezeAccountUseCase(mockRepo);
    await useCase.execute('acc-100');

    expect(mockRepo.freezeAccount).toHaveBeenCalledWith('acc-100');
  });
});
