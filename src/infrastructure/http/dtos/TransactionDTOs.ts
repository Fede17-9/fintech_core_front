export type TransactionTypeDTO = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
export type TransactionStatusDTO = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface TransactionHistoryItemDTO {
  id: string;
  type: TransactionTypeDTO;
  amount: number;
  status: TransactionStatusDTO;
  description?: string;
  createdAt: string;
  sourceAccountId?: string;
  destinationAccountId?: string;
}

export interface TransactionHistoryResponseDTO {
  accountId: string;
  transactions: TransactionHistoryItemDTO[];
}

export interface TransferRequestDTO {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  description?: string;
}

export interface TransferResponseDataDTO {
  transactionId: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  executedAt: string;
}

export interface DepositRequestDTO {
  accountId: string;
  amount: number;
}

export interface DepositResponseDataDTO {
  accountId: string;
  newBalance: number;
  depositedAt: string;
}

export interface WithdrawalRequestDTO {
  accountId: string;
  amount: number;
}

export interface WithdrawalResponseDataDTO {
  accountId: string;
  newBalance: number;
  withdrawnAt: string;
}
