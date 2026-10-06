import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthSession, AuthStatus } from '../../domain/entities/AuthSession';
import { User } from '../../domain/entities/User';
import { loginUserUseCase, registerUserUseCase } from '../../infrastructure/di';
import { TokenStorage } from '../../infrastructure/storage/TokenStorage';
import { setUnauthorizedListener } from '../../infrastructure/http/ApiClient';
import { LoginParams, RegisterParams } from '../../domain/repositories/AuthRepository';

interface AuthContextType {
  status: AuthStatus;
  session: AuthSession | null;
  login: (credentials: LoginParams) => Promise<AuthSession>;
  register: (params: RegisterParams) => Promise<User>;
  logout: () => void;
  setSession: (session: AuthSession | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const sessionFromToken = (token: string): AuthSession | null => {
  try {
    const encodedPayload = token.split('.')[1];
    if (!encodedPayload) return null;

    const normalizedPayload = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(normalizedPayload)) as { sub?: unknown; email?: unknown };

    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
      return null;
    }

    return {
      token,
      user: {
        id: payload.sub,
        name: payload.email,
        email: payload.email,
      },
    };
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    // Registrar el listener de desautorización 401 centralizado en ApiClient
    setUnauthorizedListener(() => {
      TokenStorage.removeToken();
      setSessionState(null);
      setStatus('anonymous');
    });

    // Restauración inicial de sesión
    const token = TokenStorage.getToken();
    if (token) {
      const restoredSession = sessionFromToken(token);
      if (restoredSession) {
        setSessionState(restoredSession);
        setStatus('authenticated');
      } else {
        // El backend será quien confirme o invalide tokens no decodificables.
        setStatus('authenticated');
      }
    } else {
      setStatus('anonymous');
    }

    return () => {
      setUnauthorizedListener(null);
    };
  }, []);

  const login = async (credentials: LoginParams): Promise<AuthSession> => {
    setStatus('loading');
    try {
      const newSession = await loginUserUseCase.execute(credentials);
      TokenStorage.setToken(newSession.token);
      setSessionState(newSession);
      setStatus('authenticated');
      return newSession;
    } catch (error) {
      setStatus('error');
      throw error;
    }
  };

  const register = async (params: RegisterParams): Promise<User> => {
    // El backend responde 201 con { id, name, email, createdAt } sin token JWT
    return await registerUserUseCase.execute(params);
  };

  const logout = (): void => {
    TokenStorage.removeToken();
    setSessionState(null);
    setStatus('anonymous');
  };

  const setSession = (newSession: AuthSession | null): void => {
    setSessionState(newSession);
    if (newSession) {
      TokenStorage.setToken(newSession.token);
      setStatus('authenticated');
    } else {
      TokenStorage.removeToken();
      setStatus('anonymous');
    }
  };

  return (
    <AuthContext.Provider value={{ status, session, login, register, logout, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
