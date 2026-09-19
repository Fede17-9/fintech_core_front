import { Account } from '../../domain/entities/Account';
import { AccountOutputDTO } from '../http/dtos/AccountDTOs';

export class AccountMapper {
  static toDomain(dto: AccountOutputDTO): Account {
    const numericBalance =
      typeof dto.balance === 'number'
        ? dto.balance
        : parseFloat(dto.balance) || 0;

    return {
      id: dto.id,
      accountNumber: dto.accountNumber,
      balance: numericBalance,
      status: dto.status,
      userId: dto.userId,
      createdAt: dto.createdAt,
    };
  }
}
