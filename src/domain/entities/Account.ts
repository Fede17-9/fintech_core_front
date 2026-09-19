export type AccountStatus = 'ACTIVE' | 'FROZEN';

export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  status: AccountStatus;
  userId: string;
  createdAt?: string;
}
