import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="page-card text-center">
      <h2>404 - Página no encontrada</h2>
      <p>La ruta que buscas no existe.</p>
      <Link to="/" className="btn btn-primary">
        Volver al Inicio
      </Link>
    </div>
  );
};
