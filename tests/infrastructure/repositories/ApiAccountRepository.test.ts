import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiAccountRepository } from '../../../src/infrastructure/repositories/ApiAccountRepository';
import { apiClient } from '../../../src/infrastructure/http/ApiClient';

describe('ApiAccountRepository', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getAccounts y createAccount invocan los endpoints de API', async () => {
    const mockGet = vi.spyOn(apiClient, 'get').mockResolvedValue([{ id: 'acc-1', accountNumber: 'ACC-1', balance: 100, status: 'ACTIVE', userId: 'u1' }]);
    const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({ id: 'acc-2', accountNumber: 'ACC-2', balance: 0, status: 'ACTIVE', userId: 'u1' });

    const accountRepo = new ApiAccountRepository();
    const accounts = await accountRepo.getAccounts();
    const created = await accountRepo.createAccount();

    expect(accounts).toHaveLength(1);
    expect(created.id).toBe('acc-2');
    expect(mockGet).toHaveBeenCalledWith('/api/accounts');
    expect(mockPost).toHaveBeenCalledWith('/api/accounts');
  });

  it('getBalance, freezeAccount y unfreezeAccount invocan los endpoints correspondientes', async () => {
    const mockGet = vi.spyOn(apiClient, 'get').mockResolvedValue({ id: 'acc-1', accountNumber: 'ACC-1', balance: 250, status: 'ACTIVE', userId: 'u1' });
    const mockPatch = vi.spyOn(apiClient, 'patch').mockResolvedValue(undefined);

    const accountRepo = new ApiAccountRepository();
    const balance = await accountRepo.getBalance('acc-1');
    await accountRepo.freezeAccount('acc-1');
    await accountRepo.unfreezeAccount('acc-1');

    expect(balance.balance).toBe(250);
    expect(mockGet).toHaveBeenCalledWith('/api/accounts/acc-1/balance');
    expect(mockPatch).toHaveBeenNthCalledWith(1, '/api/accounts/acc-1/freeze');
    expect(mockPatch).toHaveBeenNthCalledWith(2, '/api/accounts/acc-1/unfreeze');
  });
});
