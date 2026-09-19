import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AuthGuard: React.FC = () => {
  const { status, isAuthenticated } = useAuth();

  // Restauración de sesión en progreso: retener vista para evitar destellos de contenido privado
  if (status === 'loading') {
    return <LoadingSpinner message="Verificando sesión..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
