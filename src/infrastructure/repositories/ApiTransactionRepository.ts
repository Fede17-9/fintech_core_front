import {
  TransactionRepository,
  TransferParams,
  DepositParams,
  DepositResult,
  WithdrawParams,
  WithdrawResult,
} from '../../domain/repositories/TransactionRepository';
import { TransactionRecord, TransactionHistory } from '../../domain/entities/Transaction';
import { apiClient } from '../http/ApiClient';
import {
  TransferRequestDTO,
  TransferResponseDataDTO,
  DepositRequestDTO,
  DepositResponseDataDTO,
  WithdrawalRequestDTO,
  WithdrawalResponseDataDTO,
  TransactionHistoryResponseDTO,
} from '../http/dtos/TransactionDTOs';
import { TransactionMapper } from '../mappers/TransactionMapper';

export class ApiTransactionRepository implements TransactionRepository {
  async transfer(params: TransferParams): Promise<TransactionRecord> {
    const dto = await apiClient.post<TransferResponseDataDTO, TransferRequestDTO>(
      '/api/transactions/transfer',
      params
    );
    return TransactionMapper.transferDtoToRecord(dto);
  }

  async deposit(params: DepositParams): Promise<DepositResult> {
    const dto = await apiClient.post<DepositResponseDataDTO, DepositRequestDTO>(
      '/api/transactions/deposit',
      params
    );
    return {
      accountId: dto.accountId,
      newBalance: dto.newBalance,
      depositedAt: dto.depositedAt,
    };
  }

  async withdraw(params: WithdrawParams): Promise<WithdrawResult> {
    const dto = await apiClient.post<WithdrawalResponseDataDTO, WithdrawalRequestDTO>(
      '/api/transactions/withdrawal',
      params
    );
    return {
      accountId: dto.accountId,
      newBalance: dto.newBalance,
      withdrawnAt: dto.withdrawnAt,
    };
  }

  async getHistory(accountId: string): Promise<TransactionHistory> {
    const dto = await apiClient.get<TransactionHistoryResponseDTO>(
      `/api/transactions/history/${accountId}`
    );
    return TransactionMapper.toHistoryDomain(dto);
  }
}
