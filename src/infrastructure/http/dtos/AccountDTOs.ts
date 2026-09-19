export type AccountStatusDTO = 'ACTIVE' | 'FROZEN';

export interface AccountOutputDTO {
  id: string;
  accountNumber: string;
  balance: number | string;
  status: AccountStatusDTO;
  userId: string;
  createdAt?: string;
}
