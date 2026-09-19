import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuthContext } from '../../../src/presentation/context/AuthContext';
import { useAuth } from '../../../src/presentation/hooks/useAuth';
import { TokenStorage } from '../../../src/infrastructure/storage/TokenStorage';
import * as di from '../../../src/infrastructure/di';
import * as apiClientModule from '../../../src/infrastructure/http/ApiClient';
import { ApiError } from '../../../src/domain/errors/ApiError';

describe('AuthContext', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    TokenStorage.removeToken();
  });

  it('useAuthContext lanza error si se usa fuera de AuthProvider', () => {
    expect(() => renderHook(() => useAuthContext())).toThrow(
      'useAuthContext debe ser utilizado dentro de un AuthProvider'
    );
  });

  it('AuthProvider inicializa como anonymous si no hay token', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.status).toBe('anonymous');
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('AuthProvider inicializa como authenticated si existe token', () => {
    TokenStorage.setToken('existing-token');
    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.status).toBe('authenticated');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('AuthProvider responde al listener de desautorización 401', () => {
    let registeredListener: (() => void) | null = null;
    vi.spyOn(apiClientModule, 'setUnauthorizedListener').mockImplementation((listener) => {
      registeredListener = listener;
    });

    TokenStorage.setToken('initial-token');
    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.status).toBe('authenticated');
    expect(registeredListener).not.toBeNull();

    act(() => {
      if (registeredListener) {
        registeredListener();
      }
    });

    expect(result.current.status).toBe('anonymous');
    expect(TokenStorage.getToken()).toBeNull();
  });

  it('permite establecer manualmente la sesión mediante setSession', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    const mockSession = { token: 'jwt-set', user: { id: 'u-set', name: 'Set', email: 'set@test.com' } };
    act(() => {
      result.current.setSession(mockSession);
    });
    expect(result.current.status).toBe('authenticated');
    expect(result.current.session).toEqual(mockSession);

    act(() => {
      result.current.setSession(null);
    });
    expect(result.current.status).toBe('anonymous');
  });
});
