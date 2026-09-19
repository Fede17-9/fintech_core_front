import { Account } from '../entities/Account';

export interface AccountRepository {
  getAccounts(): Promise<Account[]>;
  createAccount(): Promise<Account>;
  getBalance(accountId: string): Promise<Account>;
  freezeAccount(accountId: string): Promise<void>;
  unfreezeAccount(accountId: string): Promise<void>;
}
