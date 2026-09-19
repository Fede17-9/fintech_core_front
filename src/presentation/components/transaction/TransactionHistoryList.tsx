import React from 'react';
import { TransactionRecord } from '../../../domain/entities/Transaction';

interface TransactionHistoryListProps {
  transactions: TransactionRecord[];
}

export const TransactionHistoryList: React.FC<TransactionHistoryListProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return <p className="text-muted text-center">No hay transacciones registradas.</p>;
  }

  return (
    <div className="transaction-history-list">
      {transactions.map((tx) => {
        const formattedAmount = new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'USD',
        }).format(tx.amount);

        const isIncome = tx.type === 'DEPOSIT';

        return (
          <div key={tx.id} className="tx-card-item">
            <div className="tx-type-badge">
              <span className={`badge-type ${isIncome ? 'type-deposit' : 'type-withdrawal'}`}>
                {tx.type}
              </span>
              <span className="tx-time">{new Date(tx.createdAt).toLocaleString()}</span>
            </div>

            {tx.description && <p className="tx-description">{tx.description}</p>}

            <div className="tx-amount-status">
              <span className={`tx-amount-value ${isIncome ? 'amount-plus' : 'amount-minus'}`}>
                {isIncome ? `+${formattedAmount}` : `-${formattedAmount}`}
              </span>
              <span className={`status-pill status-${tx.status.toLowerCase()}`}>{tx.status}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
