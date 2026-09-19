import { TransactionRepository, TransferParams } from '../../domain/repositories/TransactionRepository';
import { TransactionRecord } from '../../domain/entities/Transaction';

export class TransferMoneyUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(params: TransferParams): Promise<TransactionRecord> {
    return this.transactionRepository.transfer(params);
  }
}
