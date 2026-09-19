import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { TransactionHistory } from '../../domain/entities/Transaction';

export class GetTransactionHistoryUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(accountId: string): Promise<TransactionHistory> {
    return this.transactionRepository.getHistory(accountId);
  }
}
