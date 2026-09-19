import { describe, it, expect, vi } from 'vitest';
import { RegisterUserUseCase } from '../../../src/application/auth/RegisterUserUseCase';
import { AuthRepository } from '../../../src/domain/repositories/AuthRepository';

describe('RegisterUserUseCase', () => {
  it('ejecuta el registro de usuario invocando el repositorio', async () => {
    const mockAuthRepo: AuthRepository = {
      login: vi.fn(),
      register: vi.fn(),
    };

    const expectedUser = {
      id: 'u2',
      name: 'Maria',
      email: 'maria@test.com',
      createdAt: '2026-09-19T00:00:00.000Z',
    };
    vi.mocked(mockAuthRepo.register).mockResolvedValue(expectedUser);

    const useCase = new RegisterUserUseCase(mockAuthRepo);
    const result = await useCase.execute({ name: 'Maria', email: 'maria@test.com', password: 'password123' });

    expect(result).toEqual(expectedUser);
    expect(mockAuthRepo.register).toHaveBeenCalledWith({ name: 'Maria', email: 'maria@test.com', password: 'password123' });
  });
});
