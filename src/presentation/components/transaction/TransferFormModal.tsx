import React, { useState } from 'react';
import { Account } from '../../../domain/entities/Account';
import { TransferMoneySchema } from '../../../infrastructure/validation/TransactionSchemas';
import { ApiError } from '../../../domain/errors/ApiError';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ErrorAlert } from '../common/ErrorAlert';

interface TransferFormModalProps {
  accounts: Account[];
  defaultSourceAccountId?: string;
  isOpen: boolean;
  isLoading: boolean;
  error: ApiError | null;
  onClose: () => void;
  onSubmit: (params: {
    sourceAccountId: string;
    destinationAccountId: string;
    amount: number;
    description?: string;
  }) => Promise<void>;
}

export const TransferFormModal: React.FC<TransferFormModalProps> = ({
  accounts,
  defaultSourceAccountId,
  isOpen,
  isLoading,
  error,
  onClose,
  onSubmit,
}) => {
  const [sourceAccountId, setSourceAccountId] = useState(defaultSourceAccountId || accounts[0]?.id || '');
  const [destinationAccountId, setDestinationAccountId] = useState(
    accounts.find((a) => a.id !== (defaultSourceAccountId || accounts[0]?.id))?.id || ''
  );
  const [amountStr, setAmountStr] = useState('');
  const [description, setDescription] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const numericAmount = parseFloat(amountStr);
    const validation = TransferMoneySchema.safeParse({
      sourceAccountId,
      destinationAccountId,
      amount: isNaN(numericAmount) ? 0 : numericAmount,
      description: description || undefined,
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

    await onSubmit({
      sourceAccountId,
      destinationAccountId,
      amount: numericAmount,
      description: description || undefined,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Transferencia de Fondos</h3>
          <button type="button" className="btn-close" onClick={onClose} disabled={isLoading}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <ErrorAlert error={error} />

            <div className="input-field">
              <label htmlFor="transfer-source">Cuenta de Origen</label>
              <select
                id="transfer-source"
                className="input-control"
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(e.target.value)}
                disabled={isLoading}
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountNumber} - Saldo: ${acc.balance.toFixed(2)} ({acc.status})
                  </option>
                ))}
              </select>
              {fieldErrors['sourceAccountId'] && (
                <span className="error-message">{fieldErrors['sourceAccountId']}</span>
              )}
            </div>

            <div className="input-field">
              <label htmlFor="transfer-destination">Cuenta de Destino (ID / UUID)</label>
              <input
                id="transfer-destination"
                type="text"
                className="input-control"
                placeholder="UUID de la cuenta destino"
                value={destinationAccountId}
                onChange={(e) => setDestinationAccountId(e.target.value)}
                disabled={isLoading}
                required
              />
              {fieldErrors['destinationAccountId'] && (
                <span className="error-message">{fieldErrors['destinationAccountId']}</span>
              )}
            </div>

            <Input
              label="Monto a Transferir"
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

            <Input
              label="Descripción (Opcional, máx 100 caracteres)"
              type="text"
              placeholder="Ej. Pago de factura"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={fieldErrors['description']}
              disabled={isLoading}
            />
          </div>

          <div className="modal-footer">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
              Confirmar Transferencia
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
