import { AccountRepository } from '../../domain/repositories/AccountRepository';

export class FreezeAccountUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<void> {
    return this.accountRepository.freezeAccount(accountId);
  }
}
