import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No hay información',
  description = 'No se encontraron registros para mostrar.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="btn btn-secondary">
          {actionLabel}
        </button>
      )}
    </div>
  );
};
