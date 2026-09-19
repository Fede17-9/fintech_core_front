import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AccountActions } from '../../../../src/presentation/components/account/AccountActions';

describe('AccountActions', () => {
  it('muestra mensaje de no autorizado cuando isOwner es false', () => {
    render(
      <AccountActions
        status="ACTIVE"
        isOwner={false}
        isLoading={false}
        onFreeze={vi.fn()}
        onUnfreeze={vi.fn()}
      />
    );

    expect(screen.getByText('No autorizado para gestionar')).toBeDefined();
  });

  it('renderiza botón Congelar para cuenta activa y dispara onFreeze', () => {
    const onFreeze = vi.fn();
    render(
      <AccountActions
        status="ACTIVE"
        isOwner={true}
        isLoading={false}
        onFreeze={onFreeze}
        onUnfreeze={vi.fn()}
      />
    );

    const freezeBtn = screen.getByRole('button', { name: 'Congelar' });
    expect(freezeBtn).toBeDefined();
    fireEvent.click(freezeBtn);
    expect(onFreeze).toHaveBeenCalledTimes(1);
  });

  it('renderiza botón Descongelar para cuenta congelada y dispara onUnfreeze', () => {
    const onUnfreeze = vi.fn();
    render(
      <AccountActions
        status="FROZEN"
        isOwner={true}
        isLoading={false}
        onFreeze={vi.fn()}
        onUnfreeze={onUnfreeze}
      />
    );

    const unfreezeBtn = screen.getByRole('button', { name: 'Descongelar' });
    expect(unfreezeBtn).toBeDefined();
    fireEvent.click(unfreezeBtn);
    expect(onUnfreeze).toHaveBeenCalledTimes(1);
  });
});
