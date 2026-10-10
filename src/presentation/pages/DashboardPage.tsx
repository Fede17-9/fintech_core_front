import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAccount } from '../hooks/useAccount';
import { useTransaction } from '../hooks/useTransaction';
import { AccountSummaryCard } from '../components/account/AccountSummaryCard';
import { AccountList } from '../components/account/AccountList';
import { AccountDetailModal } from '../components/account/AccountDetailModal';
import { DepositFormModal } from '../components/transaction/DepositFormModal';
import { WithdrawFormModal } from '../components/transaction/WithdrawFormModal';
import { TransferFormModal } from '../components/transaction/TransferFormModal';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { EmptyState } from '../components/common/EmptyState';

export const DashboardPage: React.FC = () => {
  const { session } = useAuth();
  const {
    accounts,
    selectedAccount,
    history,
    status: accountStatus,
    error: accountError,
    actionLoading: accountActionLoading,
    actionError: accountActionError,
    fetchAccounts,
    createAccount,
    freezeAccount,
    unfreezeAccount,
    selectAccount,
    closeAccountDetail,
    retry: retryAccounts,
  } = useAccount();

  const {
    isLoading: transactionLoading,
    error: transactionError,
    deposit,
    withdraw,
    transfer,
    clearState: clearTransactionState,
  } = useTransaction();

  // Estados de control de modales de transacciones
  const [activeModal, setActiveModal] = useState<'deposit' | 'withdraw' | 'transfer' | null>(null);
  const [targetAccountId, setTargetAccountId] = useState<string | undefined>(undefined);

  const handleOpenDeposit = (accountId?: string) => {
    clearTransactionState();
    setTargetAccountId(accountId || accounts[0]?.id);
    setActiveModal('deposit');
  };

  const handleOpenWithdraw = (accountId?: string) => {
    clearTransactionState();
    setTargetAccountId(accountId || accounts[0]?.id);
    setActiveModal('withdraw');
  };

  const handleOpenTransfer = (accountId?: string) => {
    clearTransactionState();
    setTargetAccountId(accountId || accounts[0]?.id);
    setActiveModal('transfer');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    clearTransactionState();
  };

  const handleDepositSubmit = async (params: { accountId: string; amount: number }) => {
    const result = await deposit(params);
    if (result) {
      // Refrescar saldo e historial desde el servidor tras confirmación del backend
      await fetchAccounts();
      if (selectedAccount && selectedAccount.id === params.accountId) {
        await selectAccount(params.accountId);
      }
      handleCloseModal();
    }
  };

  const handleWithdrawSubmit = async (params: { accountId: string; amount: number }) => {
    const result = await withdraw(params);
    if (result) {
      // Refrescar saldo e historial desde el servidor tras confirmación del backend
      await fetchAccounts();
      if (selectedAccount && selectedAccount.id === params.accountId) {
        await selectAccount(params.accountId);
      }
      handleCloseModal();
    }
  };

  const handleTransferSubmit = async (params: {
    sourceAccountId: string;
    destinationAccountId: string;
    amount: number;
    description?: string;
  }) => {
    const result = await transfer(params);
    if (result) {
      // Refrescar saldos e historial desde el servidor tras confirmación del backend
      await fetchAccounts();
      if (selectedAccount && (selectedAccount.id === params.sourceAccountId || selectedAccount.id === params.destinationAccountId)) {
        await selectAccount(selectedAccount.id);
      }
      handleCloseModal();
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">RESUMEN DE TUS FINANZAS</span>
          <h2>Panel Principal</h2>
          <p className="subtitle">
            Bienvenido, <strong>{session?.user?.name || session?.user?.email}</strong>
          </p>
        </div>
        <div className="header-actions">
          <Button
            variant="secondary"
            disabled={accounts.length === 0}
            onClick={() => handleOpenTransfer()}
          >
            Transferencia
          </Button>
          <Button
            variant="primary"
            isLoading={accountActionLoading}
            disabled={accountActionLoading}
            onClick={() => createAccount()}
          >
            + Nueva Cuenta
          </Button>
        </div>
      </div>

      <ErrorAlert error={accountActionError} />

      {/* Manejo explicito de los 4 estados principales de UI */}
      {accountStatus === 'loading' && (
        <LoadingSpinner message="Cargando tus cuentas bancarias..." />
      )}

      {accountStatus === 'error' && (
        <div className="page-card text-center" style={{ marginTop: '1rem' }}>
          <ErrorAlert error={accountError} />
          <Button variant="primary" onClick={retryAccounts} style={{ marginTop: '1rem' }}>
            Reintentar Consulta
          </Button>
        </div>
      )}

      {accountStatus === 'empty' && (
        <div className="page-card" style={{ marginTop: '1rem' }}>
          <EmptyState
            title="Aún no tienes cuentas creadas"
            description="Crea tu primera cuenta bancaria en segundos para comenzar a realizar depósitos y transferencias."
            actionLabel="Crear mi primera cuenta"
            onAction={() => createAccount()}
          />
        </div>
      )}

      {accountStatus === 'success' && (
        <>
          <AccountSummaryCard accounts={accounts} />

          <div className="quick-actions-bar">
            <span>Acciones Rápidas:</span>
            <div className="action-buttons">
              <Button variant="secondary" onClick={() => handleOpenDeposit()}>
                Depósito
              </Button>
              <Button variant="secondary" onClick={() => handleOpenWithdraw()}>
                Retiro
              </Button>
              <Button variant="secondary" onClick={() => handleOpenTransfer()}>
                Transferencia
              </Button>
            </div>
          </div>

          <div className="section-header">
            <h3>Tus Cuentas Bancarias</h3>
            <p className="subtitle">Selecciona una cuenta para consultar sus detalles y movimientos.</p>
          </div>

          <AccountList
            accounts={accounts}
            currentUserId={session?.user?.id}
            isActionLoading={accountActionLoading}
            onSelectAccount={selectAccount}
            onFreezeAccount={freezeAccount}
            onUnfreezeAccount={unfreezeAccount}
          />
        </>
      )}

      {/* Modal de Detalle e Historial de Cuenta */}
      <AccountDetailModal
        account={selectedAccount}
        history={history}
        onClose={closeAccountDetail}
      />

      {/* Modales de Transacciones */}
      {accounts.length > 0 && (
        <>
          <DepositFormModal
            accounts={accounts}
            defaultAccountId={targetAccountId}
            isOpen={activeModal === 'deposit'}
            isLoading={transactionLoading}
            error={transactionError}
            onClose={handleCloseModal}
            onSubmit={handleDepositSubmit}
          />

          <WithdrawFormModal
            accounts={accounts}
            defaultAccountId={targetAccountId}
            isOpen={activeModal === 'withdraw'}
            isLoading={transactionLoading}
            error={transactionError}
            onClose={handleCloseModal}
            onSubmit={handleWithdrawSubmit}
          />

          <TransferFormModal
            accounts={accounts}
            defaultSourceAccountId={targetAccountId}
            isOpen={activeModal === 'transfer'}
            isLoading={transactionLoading}
            error={transactionError}
            onClose={handleCloseModal}
            onSubmit={handleTransferSubmit}
          />
        </>
      )}
    </div>
  );
};
