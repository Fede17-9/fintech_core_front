export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description?: string;
  createdAt: string;
  sourceAccountId?: string;
  destinationAccountId?: string;
}

export interface TransactionHistory {
  accountId: string;
  transactions: TransactionRecord[];
}
