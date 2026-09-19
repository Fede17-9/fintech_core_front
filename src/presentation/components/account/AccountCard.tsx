import React from 'react';
import { Account } from '../../../domain/entities/Account';
import { AccountActions } from './AccountActions';

interface AccountCardProps {
  account: Account;
  isOwner: boolean;
  isActionLoading: boolean;
  onSelect: (accountId: string) => void;
  onFreeze: (accountId: string) => void;
  onUnfreeze: (accountId: string) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  isOwner,
  isActionLoading,
  onSelect,
  onFreeze,
  onUnfreeze,
}) => {
  const formattedBalance = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(account.balance);

  const isFrozen = account.status === 'FROZEN';

  return (
    <div
      className={`account-card ${isFrozen ? 'card-frozen' : 'card-active'}`}
      onClick={() => onSelect(account.id)}
    >
      <div className="account-card-header">
        <span className="account-number">{account.accountNumber}</span>
        <span className={`status-badge ${isFrozen ? 'badge-frozen' : 'badge-active'}`}>
          {isFrozen ? 'CONGELADA' : 'ACTIVA'}
        </span>
      </div>

      <div className="account-card-body">
        <span className="balance-label">Saldo Disponible</span>
        <h4 className="balance-amount">{formattedBalance}</h4>
      </div>

      <div className="account-card-footer">
        <AccountActions
          status={account.status}
          isOwner={isOwner}
          isLoading={isActionLoading}
          onFreeze={() => onFreeze(account.id)}
          onUnfreeze={() => onUnfreeze(account.id)}
        />
      </div>
    </div>
  );
};
