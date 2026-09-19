import { describe, it, expect, vi } from 'vitest';
import { TransferMoneyUseCase } from '../../../src/application/transaction/TransferMoneyUseCase';
import { TransactionRepository } from '../../../src/domain/repositories/TransactionRepository';

describe('TransferMoneyUseCase', () => {
  it('envía transferencia con origen, destino y monto', async () => {
    const mockRepo: TransactionRepository = {
      deposit: vi.fn(),
      withdraw: vi.fn(),
      transfer: vi.fn(),
      getHistory: vi.fn(),
    };

    const transferRecord = {
      id: 'tx-99',
      type: 'TRANSFER' as const,
      amount: 300,
      status: 'COMPLETED' as const,
      createdAt: '2026-09-19T00:00:00Z',
      sourceAccountId: 'acc-1',
      destinationAccountId: 'acc-2',
    };
    vi.mocked(mockRepo.transfer).mockResolvedValue(transferRecord);

    const useCase = new TransferMoneyUseCase(mockRepo);
    const result = await useCase.execute({
      sourceAccountId: 'acc-1',
      destinationAccountId: 'acc-2',
      amount: 300,
      description: 'Pago de prueba',
    });

    expect(result).toEqual(transferRecord);
    expect(mockRepo.transfer).toHaveBeenCalledWith({
      sourceAccountId: 'acc-1',
      destinationAccountId: 'acc-2',
      amount: 300,
      description: 'Pago de prueba',
    });
  });
});
