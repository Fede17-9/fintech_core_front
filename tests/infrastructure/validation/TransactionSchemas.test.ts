import { describe, it, expect } from 'vitest';
import { TransferMoneySchema, DepositMoneySchema, WithdrawalMoneySchema } from '../../../src/infrastructure/validation/TransactionSchemas';

describe('TransactionSchemas', () => {
  it('TransferMoneySchema exige UUID válidos y monto estrictamente positivo > 0', () => {
    const invalidUuid = TransferMoneySchema.safeParse({
      sourceAccountId: 'invalid',
      destinationAccountId: '123e4567-e89b-12d3-a456-426614174000',
      amount: 100,
    });
    expect(invalidUuid.success).toBe(false);

    const zeroAmount = TransferMoneySchema.safeParse({
      sourceAccountId: '123e4567-e89b-12d3-a456-426614174000',
      destinationAccountId: '123e4567-e89b-12d3-a456-426614174001',
      amount: 0,
    });
    expect(zeroAmount.success).toBe(false);

    const valid = TransferMoneySchema.safeParse({
      sourceAccountId: '123e4567-e89b-12d3-a456-426614174000',
      destinationAccountId: '123e4567-e89b-12d3-a456-426614174001',
      amount: 150,
      description: 'Pago',
    });
    expect(valid.success).toBe(true);
  });

  it('DepositMoneySchema y WithdrawalMoneySchema exigen monto estrictamente mayor a 0', () => {
    const invalidDeposit = DepositMoneySchema.safeParse({
      accountId: '123e4567-e89b-12d3-a456-426614174000',
      amount: 0,
    });
    expect(invalidDeposit.success).toBe(false);

    const validDeposit = DepositMoneySchema.safeParse({
      accountId: '123e4567-e89b-12d3-a456-426614174000',
      amount: 10,
    });
    expect(validDeposit.success).toBe(true);

    const invalidWithdraw = WithdrawalMoneySchema.safeParse({
      accountId: '123e4567-e89b-12d3-a456-426614174000',
      amount: -5,
    });
    expect(invalidWithdraw.success).toBe(false);

    const validWithdraw = WithdrawalMoneySchema.safeParse({
      accountId: '123e4567-e89b-12d3-a456-426614174000',
      amount: 50,
    });
    expect(validWithdraw.success).toBe(true);
  });
});
