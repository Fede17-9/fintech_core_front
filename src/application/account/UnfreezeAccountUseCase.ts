import { AccountRepository } from '../../domain/repositories/AccountRepository';

export class UnfreezeAccountUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<void> {
    return this.accountRepository.unfreezeAccount(accountId);
  }
}
