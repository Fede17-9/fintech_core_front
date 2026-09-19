import React from 'react';
import { Account } from '../../../domain/entities/Account';
import { TransactionHistory } from '../../../domain/entities/Transaction';
import { Button } from '../common/Button';

interface AccountDetailModalProps {
  account: Account | null;
  history: TransactionHistory | null;
  onClose: () => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  history,
  onClose,
}) => {
  if (!account) return null;

  const formattedBalance = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
  }).format(account.balance);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detalle de Cuenta</h3>
          <button type="button" className="btn-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <span>Número de Cuenta:</span>
            <strong>{account.accountNumber}</strong>
          </div>
          <div className="detail-row">
            <span>Saldo Confirmado:</span>
            <strong>{formattedBalance}</strong>
          </div>
          <div className="detail-row">
            <span>Estado:</span>
            <span className={`status-badge ${account.status === 'FROZEN' ? 'badge-frozen' : 'badge-active'}`}>
              {account.status}
            </span>
          </div>

          <hr className="modal-divider" />

          <h4>Historial de Transacciones</h4>
          {history && history.transactions.length > 0 ? (
            <ul className="history-list">
              {history.transactions.map((tx) => (
                <li key={tx.id} className="history-item">
                  <div className="tx-info">
                    <span className="tx-type">{tx.type}</span>
                    <span className="tx-date">{new Date(tx.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="tx-details">
                    <span className="tx-amount">
                      ${tx.amount.toFixed(2)}
                    </span>
                    <span className={`tx-status status-${tx.status.toLowerCase()}`}>{tx.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-center" style={{ margin: '1rem 0' }}>
              No se registran transacciones para esta cuenta.
            </p>
          )}
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
