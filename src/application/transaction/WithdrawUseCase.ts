import { TransactionRepository, WithdrawParams, WithdrawResult } from '../../domain/repositories/TransactionRepository';

export class WithdrawUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(params: WithdrawParams): Promise<WithdrawResult> {
    return this.transactionRepository.withdraw(params);
  }
}
