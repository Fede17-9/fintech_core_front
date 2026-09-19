import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { RegisterPage } from '../../../src/presentation/pages/RegisterPage';
import * as useAuthModule from '../../../src/presentation/hooks/useAuth';

vi.mock('../../../src/presentation/hooks/useAuth');

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra errores de validación Zod cuando se envía datos inválidos', async () => {
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
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    const errorEl = await screen.findByText('El nombre completo debe tener al menos 3 caracteres');
    expect(errorEl).toBeDefined();
  });

  it('ejecuta registro exitoso y muestra mensaje de éxito', async () => {
    const mockRegister = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      status: 'anonymous',
      session: null,
      error: null,
      isLoading: false,
      isAuthenticated: false,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Nombre Completo'), {
      target: { value: 'Juan Perez' },
    });
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), {
      target: { value: 'juan@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Juan Perez',
        email: 'juan@test.com',
        password: 'password123',
      });
      expect(
        screen.getByText('Usuario registrado con éxito. Serás redirigido a iniciar sesión...')
      ).toBeDefined();
    });
  });
});
