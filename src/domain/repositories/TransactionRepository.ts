import { TransactionHistory, TransactionRecord } from '../entities/Transaction';

export interface TransferParams {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  description?: string;
}

export interface DepositParams {
  accountId: string;
  amount: number;
}

export interface DepositResult {
  accountId: string;
  newBalance: number;
  depositedAt: string;
}

export interface WithdrawParams {
  accountId: string;
  amount: number;
}

export interface WithdrawResult {
  accountId: string;
  newBalance: number;
  withdrawnAt: string;
}

export interface TransactionRepository {
  transfer(params: TransferParams): Promise<TransactionRecord>;
  deposit(params: DepositParams): Promise<DepositResult>;
  withdraw(params: WithdrawParams): Promise<WithdrawResult>;
  getHistory(accountId: string): Promise<TransactionHistory>;
}
