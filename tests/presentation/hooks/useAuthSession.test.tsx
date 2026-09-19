import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { AuthProvider } from '../../../src/presentation/context/AuthContext';
import { useAuthSession } from '../../../src/presentation/hooks/useAuthSession';

describe('useAuthSession Hook', () => {
  it('useAuthSession es alias de useAuth y obtiene sesión del contexto', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuthSession(), { wrapper });
    expect(result.current.status).toBe('anonymous');
    expect(result.current.isAuthenticated).toBe(false);
  });
});
