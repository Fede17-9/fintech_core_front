import { apiClient } from '../http/ApiClient';
import { TransferRequestDTO, TransferResponseDataDTO } from '../http/dtos/TransactionDTOs';

export class TransferService {
  static async transfer(data: TransferRequestDTO): Promise<TransferResponseDataDTO> {
    return apiClient.post<TransferResponseDataDTO, TransferRequestDTO>('/api/transactions/transfer', data);
  }
}
