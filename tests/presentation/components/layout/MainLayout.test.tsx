import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { MainLayout } from '../../../../src/presentation/components/layout/MainLayout';
import * as useAuthSessionModule from '../../../../src/presentation/hooks/useAuthSession';

vi.mock('../../../../src/presentation/hooks/useAuthSession');

describe('MainLayout', () => {
  it('renderiza enlaces de Iniciar Sesión y Registrarse cuando no está autenticado', () => {
    vi.spyOn(useAuthSessionModule, 'useAuthSession').mockReturnValue({
      status: 'anonymous',
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter>
        <MainLayout>
          <div>Contenido Hijo</div>
        </MainLayout>
      </MemoryRouter>
    );

    expect(screen.getByText('Fintech Core')).toBeDefined();
    expect(screen.getByText('Iniciar Sesión')).toBeDefined();
    expect(screen.getByText('Registrarse')).toBeDefined();
    expect(screen.getByText('Contenido Hijo')).toBeDefined();
  });

  it('renderiza email del usuario y botón de logout cuando está autenticado', () => {
    const mockLogout = vi.fn();
    vi.spyOn(useAuthSessionModule, 'useAuthSession').mockReturnValue({
      status: 'authenticated',
      session: {
        token: 'token-123',
        user: { id: 'usr-1', email: 'test@fintech.com', name: 'Usuario Test' },
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter>
        <MainLayout>
          <div>Contenido Dashboard</div>
        </MainLayout>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('test@fintech.com')).toBeDefined();

    const logoutBtn = screen.getByRole('button', { name: 'Cerrar Sesión' });
    expect(logoutBtn).toBeDefined();

    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
