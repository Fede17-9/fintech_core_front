import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from '../../../src/presentation/pages/NotFoundPage';

describe('NotFoundPage', () => {
  it('renderiza título 404 y enlace de retorno', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText('404 - Página no encontrada')).toBeDefined();
    expect(screen.getByText('Volver al Inicio')).toBeDefined();
  });
});
