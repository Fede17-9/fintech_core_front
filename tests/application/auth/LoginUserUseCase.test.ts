import { describe, it, expect, vi } from 'vitest';
import { LoginUserUseCase } from '../../../src/application/auth/LoginUserUseCase';
import { AuthRepository } from '../../../src/domain/repositories/AuthRepository';

describe('LoginUserUseCase', () => {
  it('ejecuta el inicio de sesión invocando el repositorio de autenticación', async () => {
    const mockAuthRepo: AuthRepository = {
      login: vi.fn(),
      register: vi.fn(),
    };

    const expectedSession = {
      token: 'jwt-123',
      user: { id: 'u1', name: 'Test', email: 'test@example.com' },
    };
    vi.mocked(mockAuthRepo.login).mockResolvedValue(expectedSession);

    const useCase = new LoginUserUseCase(mockAuthRepo);
    const result = await useCase.execute({ email: 'test@example.com', password: 'password123' });

    expect(result).toEqual(expectedSession);
    expect(mockAuthRepo.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
  });
});
