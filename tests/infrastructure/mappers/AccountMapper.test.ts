import { describe, it, expect } from 'vitest';
import { AccountMapper } from '../../../src/infrastructure/mappers/AccountMapper';

describe('AccountMapper', () => {
  it('mapea un AccountDTO con balance numérico o string', () => {
    const dto = {
      id: 'acc-1',
      accountNumber: '12345678',
      balance: 500.25,
      status: 'ACTIVE' as const,
      userId: 'usr-1',
      createdAt: '2026-09-19T00:00:00Z',
    };
    const domain = AccountMapper.toDomain(dto);
    expect(domain.balance).toBe(500.25);
    expect(domain.id).toBe('acc-1');

    const dtoStr = {
      id: 'acc-1',
      accountNumber: 'ACC-123456789',
      balance: '1500.50',
      status: 'ACTIVE' as const,
      userId: 'u1',
    };
    const domainStr = AccountMapper.toDomain(dtoStr);
    expect(domainStr.balance).toBe(1500.5);
  });

  it('mapea un AccountDTO con balance inválido asignando fallback 0', () => {
    const dto = {
      id: 'acc-2',
      accountNumber: '87654321',
      balance: 'invalid_number' as any,
      status: 'FROZEN' as const,
      userId: 'usr-1',
    };
    const domain = AccountMapper.toDomain(dto);
    expect(domain.balance).toBe(0);
    expect(domain.status).toBe('FROZEN');
  });
});
