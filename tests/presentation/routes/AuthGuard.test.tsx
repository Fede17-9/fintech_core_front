import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthGuard } from '../../../src/presentation/routes/AuthGuard';
import * as useAuthModule from '../../../src/presentation/hooks/useAuth';

vi.mock('../../../src/presentation/hooks/useAuth');

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el spinner cuando el estado es loading', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      status: 'loading',
      session: null,
      error: null,
      isLoading: true,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<AuthGuard />}>
            <Route path="/dashboard" element={<div>Contenido Protegido</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Verificando sesión...')).toBeDefined();
    expect(screen.queryByText('Contenido Protegido')).toBeNull();
  });

  it('redirecciona a /login cuando no está autenticado', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      status: 'anonymous',
      session: null,
      error: null,
      isLoading: false,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Página de Login</div>} />
          <Route element={<AuthGuard />}>
            <Route path="/dashboard" element={<div>Contenido Protegido</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Página de Login')).toBeDefined();
    expect(screen.queryByText('Contenido Protegido')).toBeNull();
  });

  it('renderiza el Outlet cuando está autenticado', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      status: 'authenticated',
      session: {
        token: 'token-abc',
        user: { id: 'usr-1', email: 'test@fintech.com', name: 'Usuario' },
      },
      error: null,
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<AuthGuard />}>
            <Route path="/dashboard" element={<div>Contenido Protegido</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Contenido Protegido')).toBeDefined();
  });
});
