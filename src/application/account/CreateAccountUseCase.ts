import { AccountRepository } from '../../domain/repositories/AccountRepository';
import { Account } from '../../domain/entities/Account';

export class CreateAccountUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(): Promise<Account> {
    return this.accountRepository.createAccount();
  }
}
