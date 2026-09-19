import React from 'react';
import { Account } from '../../../domain/entities/Account';
import { AccountCard } from './AccountCard';

interface AccountListProps {
  accounts: Account[];
  currentUserId?: string;
  isActionLoading: boolean;
  onSelectAccount: (accountId: string) => void;
  onFreezeAccount: (accountId: string) => void;
  onUnfreezeAccount: (accountId: string) => void;
}

export const AccountList: React.FC<AccountListProps> = ({
  accounts,
  currentUserId,
  isActionLoading,
  onSelectAccount,
  onFreezeAccount,
  onUnfreezeAccount,
}) => {
  return (
    <div className="account-list-grid">
      {accounts.map((account) => {
        // Verificar si el usuario actual es el propietario según backend DTO
        const isOwner = currentUserId ? account.userId === currentUserId : true;

        return (
          <AccountCard
            key={account.id}
            account={account}
            isOwner={isOwner}
            isActionLoading={isActionLoading}
            onSelect={onSelectAccount}
            onFreeze={onFreezeAccount}
            onUnfreeze={onUnfreezeAccount}
          />
        );
      })}
    </div>
  );
};
