import { AccountRepository } from '../../domain/repositories/AccountRepository';
import { Account } from '../../domain/entities/Account';
import { apiClient } from '../http/ApiClient';
import { AccountOutputDTO } from '../http/dtos/AccountDTOs';
import { AccountMapper } from '../mappers/AccountMapper';

export class ApiAccountRepository implements AccountRepository {
  async getAccounts(): Promise<Account[]> {
    const dtos = await apiClient.get<AccountOutputDTO[]>('/api/accounts');
    return dtos.map((dto) => AccountMapper.toDomain(dto));
  }

  async createAccount(): Promise<Account> {
    const dto = await apiClient.post<AccountOutputDTO>('/api/accounts');
    return AccountMapper.toDomain(dto);
  }

  async getBalance(accountId: string): Promise<Account> {
    const dto = await apiClient.get<AccountOutputDTO>(`/api/accounts/${accountId}/balance`);
    return AccountMapper.toDomain(dto);
  }

  async freezeAccount(accountId: string): Promise<void> {
    await apiClient.patch<unknown>(`/api/accounts/${accountId}/freeze`);
  }

  async unfreezeAccount(accountId: string): Promise<void> {
    await apiClient.patch<unknown>(`/api/accounts/${accountId}/unfreeze`);
  }
}
