import { ApiAuthRepository } from './repositories/ApiAuthRepository';
import { ApiAccountRepository } from './repositories/ApiAccountRepository';
import { ApiTransactionRepository } from './repositories/ApiTransactionRepository';

import { LoginUserUseCase } from '../application/auth/LoginUserUseCase';
import { RegisterUserUseCase } from '../application/auth/RegisterUserUseCase';
import { GetUserAccountsUseCase } from '../application/account/GetUserAccountsUseCase';
import { CreateAccountUseCase } from '../application/account/CreateAccountUseCase';
import { GetBalanceUseCase } from '../application/account/GetBalanceUseCase';
import { FreezeAccountUseCase } from '../application/account/FreezeAccountUseCase';
import { UnfreezeAccountUseCase } from '../application/account/UnfreezeAccountUseCase';
import { DepositUseCase } from '../application/transaction/DepositUseCase';
import { WithdrawUseCase } from '../application/transaction/WithdrawUseCase';
import { TransferMoneyUseCase } from '../application/transaction/TransferMoneyUseCase';
import { GetTransactionHistoryUseCase } from '../application/transaction/GetTransactionHistoryUseCase';

// Repositorios Concretos
export const authRepository = new ApiAuthRepository();
export const accountRepository = new ApiAccountRepository();
export const transactionRepository = new ApiTransactionRepository();

// Casos de Uso Auth
export const loginUserUseCase = new LoginUserUseCase(authRepository);
export const registerUserUseCase = new RegisterUserUseCase(authRepository);

// Casos de Uso Account
export const getUserAccountsUseCase = new GetUserAccountsUseCase(accountRepository);
export const createAccountUseCase = new CreateAccountUseCase(accountRepository);
export const getBalanceUseCase = new GetBalanceUseCase(accountRepository);
export const freezeAccountUseCase = new FreezeAccountUseCase(accountRepository);
export const unfreezeAccountUseCase = new UnfreezeAccountUseCase(accountRepository);

// Casos de Uso Transaction
export const depositUseCase = new DepositUseCase(transactionRepository);
export const withdrawUseCase = new WithdrawUseCase(transactionRepository);
export const transferMoneyUseCase = new TransferMoneyUseCase(transactionRepository);
export const getTransactionHistoryUseCase = new GetTransactionHistoryUseCase(transactionRepository);
