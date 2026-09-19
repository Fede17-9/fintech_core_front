import { useState, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { AuthSession, AuthStatus } from '../../domain/entities/AuthSession';
import { User } from '../../domain/entities/User';
import { LoginParams, RegisterParams } from '../../domain/repositories/AuthRepository';
import { ApiError } from '../../domain/errors/ApiError';

export interface UseAuthResult {
  status: AuthStatus;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | null;
  login: (credentials: LoginParams) => Promise<AuthSession>;
  register: (params: RegisterParams) => Promise<User>;
  logout: () => void;
  clearError: () => void;
}

export const useAuth = (): UseAuthResult => {
  const { status, session, login: contextLogin, register: contextRegister, logout: contextLogout } = useAuthContext();
  const [error, setError] = useState<ApiError | null>(null);
  const [isOperationLoading, setIsOperationLoading] = useState<boolean>(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(
    async (credentials: LoginParams): Promise<AuthSession> => {
      setIsOperationLoading(true);
      setError(null);
      try {
        const result = await contextLogin(credentials);
        setIsOperationLoading(false);
        return result;
      } catch (err: unknown) {
        setIsOperationLoading(false);
        const normalized =
          err instanceof ApiError
            ? err
            : new ApiError(
                err instanceof Error ? err.message : 'Error al iniciar sesión',
                400,
                'INVALID_CREDENTIALS'
              );
        setError(normalized);
        throw normalized;
      }
    },
    [contextLogin]
  );

  const register = useCallback(
    async (params: RegisterParams): Promise<User> => {
      setIsOperationLoading(true);
      setError(null);
      try {
        const user = await contextRegister(params);
        setIsOperationLoading(false);
        return user;
      } catch (err: unknown) {
        setIsOperationLoading(false);
        const normalized =
          err instanceof ApiError
            ? err
            : new ApiError(
                err instanceof Error ? err.message : 'Error al registrar usuario',
                400,
                'REGISTER_ERROR'
              );
        setError(normalized);
        throw normalized;
      }
    },
    [contextRegister]
  );

  const logout = useCallback(() => {
    setError(null);
    contextLogout();
  }, [contextLogout]);

  return {
    status,
    session,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || isOperationLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};
