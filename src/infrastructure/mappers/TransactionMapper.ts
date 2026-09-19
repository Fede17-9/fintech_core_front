import { TransactionRecord, TransactionHistory } from '../../domain/entities/Transaction';
import { TransactionHistoryItemDTO, TransactionHistoryResponseDTO, TransferResponseDataDTO } from '../http/dtos/TransactionDTOs';

export class TransactionMapper {
  static toRecordDomain(dto: TransactionHistoryItemDTO): TransactionRecord {
    return {
      id: dto.id,
      type: dto.type,
      amount: dto.amount,
      status: dto.status,
      description: dto.description,
      createdAt: dto.createdAt,
      sourceAccountId: dto.sourceAccountId,
      destinationAccountId: dto.destinationAccountId,
    };
  }

  static toHistoryDomain(dto: TransactionHistoryResponseDTO): TransactionHistory {
    return {
      accountId: dto.accountId,
      transactions: dto.transactions.map((t) => this.toRecordDomain(t)),
    };
  }

  static transferDtoToRecord(dto: TransferResponseDataDTO): TransactionRecord {
    return {
      id: dto.transactionId,
      type: 'TRANSFER',
      amount: dto.amount,
      status: 'COMPLETED',
      createdAt: dto.executedAt,
      sourceAccountId: dto.sourceAccountId,
      destinationAccountId: dto.destinationAccountId,
    };
  }
}
