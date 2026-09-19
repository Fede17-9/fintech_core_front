# Estado del Frontend (modelo derivado del backend)

**Fecha del análisis:** 16 de septiembre de 2026  
**Alcance:** Modelo de estado cliente inferido de entidades, DTOs y flujos HTTP confirmados.  
**Prohibición:** no inventar campos de estado no respaldados por el backend.

---

## 1. Entidades de dominio confirmadas (backend)

Estas formas deben reflejarse en el estado del frontend:

### User

| Campo | Tipo | Fuente |
|-------|------|--------|
| `id` | `string` | `LoginOutputDTO`, `RegisterUserOutputDTO` |
| `name` | `string` | Idem (mapeado desde `fullName` en dominio backend) |
| `email` | `string` | Idem |

**Nota:** el backend no expone endpoint `GET /me` ni refresh de perfil.

### Account

| Campo | Tipo | Valores | Fuente |
|-------|------|---------|--------|
| `id` | `string` | UUID | `AccountOutputDTO`, `prisma/schema.prisma` |
| `accountNumber` | `string` | `ACC-XXXXXXXXX` | `CreateAccountUseCase.ts:17` |
| `balance` | numérico en UI | `[PENDIENTE]` tipo JSON exacto | `AccountOutputDTO.balance: Decimal` |
| `status` | enum | `ACTIVE`, `FROZEN` | `Account.ts`, `schema.prisma` |
| `userId` | `string` | UUID propietario | `AccountOutputDTO` |
| `createdAt` | `string` (ISO) | — | `AccountOutputDTO` |

### Transaction (historial)

| Campo | Tipo | Valores | Fuente |
|-------|------|---------|--------|
| `id` | `string` | UUID | `TransactionHistoryItemDTO` |
| `type` | enum | `DEPOSIT`, `WITHDRAWAL`, `TRANSFER` | `GetTransactionHistoryUseCase.ts` |
| `amount` | `number` | > 0 | `TransactionHistoryItemDTO` |
| `status` | enum | `PENDING`, `COMPLETED`, `FAILED` | `Transaction.ts`, `schema.prisma` |
| `description` | `string` | — | `TransactionHistoryItemDTO` |
| `createdAt` | `string` (ISO) | — | Idem |
| `sourceAccountId` | `string?` | presente en WITHDRAWAL/TRANSFER | `GetTransactionHistoryUseCase.ts:20-22` |
| `destinationAccountId` | `string?` | presente en DEPOSIT/TRANSFER | Idem |

### AuthSession

| Campo | Tipo | Fuente |
|-------|------|--------|
| `token` | `string` | `LoginOutputDTO` |
| `user` | `User` | `LoginOutputDTO.user` |
| `expiresAt` | `Date?` | `[PENDIENTE]` — JWT expira (`JWT_EXPIRES_IN=1h`) pero backend no devuelve claim en response |

**Fuente JWT:** `JwtTokenService.ts`, `.env-example`

---

## 2. Slices de estado propuestos

### 2.1 `auth`

```typescript
interface AuthState {
  status: 'anonymous' | 'authenticated' | 'loading' | 'error';
  session: AuthSession | null;
  error: ApiError | null;
}
```

**Transiciones observables:**

| Evento | Origen | Efecto | Backend |
|--------|--------|--------|---------|
| `loginSuccess` | form login | `session` poblado, `status: authenticated` | `POST /api/auth/login` |
| `registerSuccess` | form register | `[PENDIENTE]` auto-login no implementado en backend | `POST /api/auth/register` devuelve user sin token |
| `logout` | UI | limpiar token y session | No hay endpoint logout |
| `tokenInvalid` | 401 `INVALID_TOKEN` | `anonymous` | `AuthMiddleware.ts` |

**Decisión derivada:** tras register exitoso, el frontend debe redirigir a login o llamar login automáticamente (no hay token en register response).

**Fuente:** `RegisterUserUseCase.ts` (retorna user sin token), `LoginUseCase.ts`

### 2.2 `accounts`

```typescript
interface AccountsState {
  items: Account[];
  selectedAccountId: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: ApiError | null;
}
```

**Operaciones:**

| Acción | Mutación esperada | Endpoint |
|--------|-------------------|----------|
| Cargar lista | `items` = response | `GET /api/accounts` |
| Crear cuenta | append a `items` | `POST /api/accounts` |
| Consultar balance | actualizar item o cache | `GET /api/accounts/:id/balance` |
| Freeze/unfreeze | actualizar `status` del item | `PATCH .../freeze`, `PATCH .../unfreeze` |

**Fuente:** `AccountController.ts`, `GetUserAccountsUseCase.ts`

### 2.3 `transactions`

```typescript
interface TransactionsState {
  historyByAccountId: Record<string, TransactionRecord[]>;
  lastOperation: DepositResult | WithdrawalResult | TransferResult | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: ApiError | null;
}
```

**Resultados de operaciones mutables:**

| Operación | Campos en `data` | Fuente |
|-----------|------------------|--------|
| Depósito | `accountId`, `newBalance`, `depositedAt` | `DepositDTOs.ts` |
| Retiro | `accountId`, `newBalance`, `withdrawnAt` | `WithdrawalDTOs.ts` |
| Transferencia | `transactionId`, `sourceAccountId`, `destinationAccountId`, `amount`, `executedAt` | `TransferDTOs.ts` |

**Decisión derivada:** tras depósito/retiro, actualizar `balance` en `accounts.items` con `newBalance` sin re-fetch obligatorio.

### 2.4 `ui` (cross-cutting)

```typescript
interface UiState {
  globalError: ApiError | null;
  pendingRequests: number;
}
```

---

## 3. Estado derivado (selectors)

| Selector | Cálculo | Uso UI |
|----------|---------|--------|
| `activeAccounts` | `items.filter(a => a.status === 'ACTIVE')` | Habilitar depósito/retiro/transfer |
| `frozenAccounts` | `items.filter(a => a.status === 'FROZEN')` | Mostrar badge / deshabilitar ops |
| `selectedAccount` | `items.find(id === selectedAccountId)` | Detalle de cuenta |
| `isAuthenticated` | `auth.status === 'authenticated' && session !== null` | Guard de rutas |

**Fuente de reglas de negocio:** `Account.ts` (operaciones bloqueadas en FROZEN), use cases de transacción.

---

## 4. Persistencia cliente

| Dato | Persistir | Fuente / razón |
|------|-----------|----------------|
| JWT `token` | Sí (localStorage o sessionStorage) | Requerido en header Bearer |
| `user` | Opcional (derivable del token `[PENDIENTE]` decode) | Login response incluye user |
| Lista de cuentas | No (re-fetch al montar) | Siempre disponible vía API |
| Historial transacciones | Cache en memoria | `GET /api/transactions/history/:accountId` |

**[PENDIENTE]:** decodificar JWT en cliente para `userId`/`email` vs confiar solo en respuesta de login.

**Payload JWT confirmado:** `{ userId, email }` — `TokenService.ts`, `JwtTokenService.ts`

---

## 5. Sincronización tras mutaciones

| Mutación backend | Actualización de estado recomendada |
|------------------|-------------------------------------|
| `POST /api/accounts` | Invalidar/refetch `accounts.items` o append |
| `POST .../deposit` | Actualizar balance local + invalidar history |
| `POST .../withdrawal` | Idem |
| `POST .../transfer` | Actualizar ambas cuentas si están en cache + invalidar histories |
| `PATCH .../freeze` | `status → FROZEN` en account local |
| `PATCH .../unfreeze` | `status → ACTIVE` |

---

## 6. Errores en estado

Mapear `code` del backend a acciones UI:

| `code` | Acción UI sugerida |
|--------|-------------------|
| `UNAUTHORIZED` / `INVALID_TOKEN` | Logout + redirect login |
| `INVALID_CREDENTIALS` | Mostrar en form login |
| `VALIDATION_ERROR` | Mostrar `errors[]` por campo |
| `INSUFFICIENT_FUNDS` | Toast/modal en operación monetaria |
| `ACCOUNT_NOT_FOUND` | Redirect o mensaje en detalle |
| `DOMAIN_VALIDATION_ERROR` | Mensaje genérico (cuenta congelada, etc.) |
| `INTERNAL_SERVER_ERROR` | Mensaje genérico + retry |

**Fuente:** `ErrorHandler.ts`, `validateRequest.ts`, `AuthMiddleware.ts`

---

## 7. [PENDIENTE]

- [ ] Librería de estado (Context, Zustand, Redux Toolkit, TanStack Query, etc.).
- [ ] Estrategia de cache (stale-while-revalidate vs store global).
- [ ] Manejo de expiración JWT (`1h`) sin refresh token.
- [ ] Normalización de entidades (byId maps vs arrays).
- [ ] Tipo exacto de `balance` tras parse JSON.

---

## 8. Prohibición explícita

No modelar estado para endpoints inexistentes (logout server-side, refresh token, perfil editable, listado global de usuarios, etc.).
