import React from 'react';
import { Account } from '../../../domain/entities/Account';

interface AccountSummaryCardProps {
  accounts: Account[];
}

export const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({ accounts }) => {
  const activeAccounts = accounts.filter((a) => a.status === 'ACTIVE');
  const frozenAccounts = accounts.filter((a) => a.status === 'FROZEN');

  const totalActiveBalance = activeAccounts.reduce((sum, a) => sum + a.balance, 0);

  // Formato monetario es presentación visual
  const formattedTotal = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(totalActiveBalance);

  return (
    <div className="account-summary-card">
      <div className="summary-item">
        <span className="summary-label">Saldo Total Activo</span>
        <h3 className="summary-value">{formattedTotal}</h3>
      </div>
      <div className="summary-stats">
        <div className="stat">
          <span className="stat-value">{accounts.length}</span>
          <span className="stat-label">Cuentas Totales</span>
        </div>
        <div className="stat">
          <span className="stat-value text-success">{activeAccounts.length}</span>
          <span className="stat-label">Activas</span>
        </div>
        <div className="stat">
          <span className="stat-value text-danger">{frozenAccounts.length}</span>
          <span className="stat-label">Congeladas</span>
        </div>
      </div>
    </div>
  );
};
