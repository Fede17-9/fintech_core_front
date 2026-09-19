import React from 'react';
import { AccountStatus } from '../../../domain/entities/Account';
import { Button } from '../common/Button';

interface AccountActionsProps {
  status: AccountStatus;
  isOwner: boolean;
  isLoading: boolean;
  onFreeze: () => void;
  onUnfreeze: () => void;
}

export const AccountActions: React.FC<AccountActionsProps> = ({
  status,
  isOwner,
  isLoading,
  onFreeze,
  onUnfreeze,
}) => {
  if (!isOwner) {
    return <span className="text-muted small">No autorizado para gestionar</span>;
  }

  return (
    <div className="account-actions">
      {status === 'ACTIVE' ? (
        <Button
          variant="secondary"
          isLoading={isLoading}
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            onFreeze();
          }}
        >
          Congelar
        </Button>
      ) : (
        <Button
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            onUnfreeze();
          }}
        >
          Descongelar
        </Button>
      )}
    </div>
  );
};
