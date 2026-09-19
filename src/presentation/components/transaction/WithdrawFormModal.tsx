import React, { useState } from 'react';
import { Account } from '../../../domain/entities/Account';
import { WithdrawalMoneySchema } from '../../../infrastructure/validation/TransactionSchemas';
import { ApiError } from '../../../domain/errors/ApiError';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ErrorAlert } from '../common/ErrorAlert';

interface WithdrawFormModalProps {
  accounts: Account[];
  defaultAccountId?: string;
  isOpen: boolean;
  isLoading: boolean;
  error: ApiError | null;
  onClose: () => void;
  onSubmit: (params: { accountId: string; amount: number }) => Promise<void>;
}

export const WithdrawFormModal: React.FC<WithdrawFormModalProps> = ({
  accounts,
  defaultAccountId,
  isOpen,
  isLoading,
  error,
  onClose,
  onSubmit,
}) => {
  const [accountId, setAccountId] = useState(defaultAccountId || accounts[0]?.id || '');
  const [amountStr, setAmountStr] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const numericAmount = parseFloat(amountStr);
    const validation = WithdrawalMoneySchema.safeParse({
      accountId,
      amount: isNaN(numericAmount) ? 0 : numericAmount,
    });

    if (!validation.success) {
      const errorsMap: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const fieldName = err.path[0];
        if (typeof fieldName === 'string') {
          errorsMap[fieldName] = err.message;
        }
      });
      setFieldErrors(errorsMap);
      return;
    }

    await onSubmit({ accountId, amount: numericAmount });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Realizar Retiro</h3>
          <button type="button" className="btn-close" onClick={onClose} disabled={isLoading}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <ErrorAlert error={error} />

            <div className="input-field">
              <label htmlFor="withdraw-account">Cuenta de Origen</label>
              <select
                id="withdraw-account"
                className="input-control"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                disabled={isLoading}
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountNumber} - Saldo: ${acc.balance.toFixed(2)} ({acc.status})
                  </option>
                ))}
              </select>
              {fieldErrors['accountId'] && (
                <span className="error-message">{fieldErrors['accountId']}</span>
              )}
            </div>

            <Input
              label="Monto a Retirar"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              error={fieldErrors['amount']}
              disabled={isLoading}
              required
            />
          </div>

          <div className="modal-footer">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
              Confirmar Retiro
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
