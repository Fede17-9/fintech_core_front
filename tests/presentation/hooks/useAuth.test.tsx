import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider } from '../../../src/presentation/context/AuthContext';
import { useAuth } from '../../../src/presentation/hooks/useAuth';
import { ApiError } from '../../../src/domain/errors/ApiError';
import { TokenStorage } from '../../../src/infrastructure/storage/TokenStorage';
import * as di from '../../../src/infrastructure/di';

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    TokenStorage.removeToken();
  });

  it('login y logout actualizan la sesión en AuthContext', async () => {
    const mockSession = { token: 'jwt-123', user: { id: 'u1', name: 'User 1', email: 'u1@test.com' } };
    vi.spyOn(di.loginUserUseCase, 'execute').mockResolvedValue(mockSession);

    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ email: 'u1@test.com', password: 'password123' });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.session).toEqual(mockSession);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.session).toBeNull();
  });

  it('maneja fallos con ApiError, Error y non-Error en login y registro', async () => {
    vi.spyOn(di.loginUserUseCase, 'execute')
      .mockRejectedValueOnce(new ApiError('Bad credentials', 400, 'BAD_CREDS'))
      .mockRejectedValueOnce('Non error object');

    const mockUser = { id: 'u-1', name: 'Ana', email: 'ana@test.com' };
    vi.spyOn(di.registerUserUseCase, 'execute')
      .mockResolvedValueOnce(mockUser)
      .mockRejectedValueOnce(new ApiError('Email taken', 400, 'DUPLICATE'))
      .mockRejectedValueOnce('Non error object');

    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await expect(result.current.login({ email: 'err@test.com', password: 'bad' })).rejects.toThrow('Bad credentials');
    });
    expect(result.current.error?.code).toBe('BAD_CREDS');

    await act(async () => {
      await expect(result.current.login({ email: 'err@test.com', password: 'bad' })).rejects.toThrow();
    });
    expect(result.current.error?.message).toBe('Error al iniciar sesión');

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();

    await act(async () => {
      const user = await result.current.register({ name: 'Ana', email: 'ana@test.com', password: 'pass' });
      expect(user).toEqual(mockUser);
    });

    await act(async () => {
      await expect(result.current.register({ name: 'Ana', email: 'ana@test.com', password: 'pass' })).rejects.toThrow('Email taken');
    });
    expect(result.current.error?.code).toBe('DUPLICATE');

    await act(async () => {
      await expect(result.current.register({ name: 'Ana', email: 'ana@test.com', password: 'pass' })).rejects.toThrow();
    });
    expect(result.current.error?.message).toBe('Error al registrar usuario');
  });
});
