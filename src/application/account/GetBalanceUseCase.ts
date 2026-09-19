import { AccountRepository } from '../../domain/repositories/AccountRepository';
import { Account } from '../../domain/entities/Account';

export class GetBalanceUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<Account> {
    return this.accountRepository.getBalance(accountId);
  }
}
