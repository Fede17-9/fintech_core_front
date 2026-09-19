import { apiClient } from '../http/ApiClient';
import {
  DepositRequestDTO,
  DepositResponseDataDTO,
  WithdrawalRequestDTO,
  WithdrawalResponseDataDTO,
  TransactionHistoryResponseDTO,
} from '../http/dtos/TransactionDTOs';

export class TransactionService {
  static async deposit(data: DepositRequestDTO): Promise<DepositResponseDataDTO> {
    return apiClient.post<DepositResponseDataDTO, DepositRequestDTO>('/api/transactions/deposit', data);
  }

  static async withdraw(data: WithdrawalRequestDTO): Promise<WithdrawalResponseDataDTO> {
    return apiClient.post<WithdrawalResponseDataDTO, WithdrawalRequestDTO>('/api/transactions/withdrawal', data);
  }

  static async getHistory(accountId: string): Promise<TransactionHistoryResponseDTO> {
    return apiClient.get<TransactionHistoryResponseDTO>(`/api/transactions/history/${accountId}`);
  }
}
