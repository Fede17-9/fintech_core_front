import { TransactionRepository, DepositParams, DepositResult } from '../../domain/repositories/TransactionRepository';

export class DepositUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(params: DepositParams): Promise<DepositResult> {
    return this.transactionRepository.deposit(params);
  }
}
