import React from 'react';
import { ApiError } from '../../../domain/errors/ApiError';

interface ErrorAlertProps {
  error: ApiError | string | null;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onRetry }) => {
  if (!error) return null;

  const message = typeof error === 'string' ? error : error.message;

  return (
    <div className="alert alert-danger" role="alert">
      <p className="alert-message">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-retry">
          Reintentar
        </button>
      )}
    </div>
  );
};
