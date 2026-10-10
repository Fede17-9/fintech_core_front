import React, { ReactNode } from 'react';
import { useAuthSession } from '../../hooks/useAuthSession';
import { Link, NavLink } from 'react-router-dom';

export const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, session, logout } = useAuthSession();

  return (
    <div className="layout">
      <header className="navbar">
        <div className="nav-brand">
          <Link to="/">
            <span className="brand-mark" aria-hidden="true">F</span>
            <span>Fintech Core</span>
          </Link>
        </div>
        <nav className="nav-links" aria-label="Navegación principal">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <span className="user-email">{session?.user?.email}</span>
              <button type="button" onClick={logout} className="btn-logout">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Iniciar Sesión</NavLink>
              <NavLink to="/register" className="nav-register">Registrarse</NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="container">{children}</main>
      <footer className="layout-footer">
        <span>Cuentas digitales</span>
        <span>Tus cuentas y movimientos, en un solo lugar.</span>
      </footer>
    </div>
  );
};
