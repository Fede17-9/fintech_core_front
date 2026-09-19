# Contrato técnico Backend → Frontend

**Fecha del análisis:** 16 de septiembre de 2026  
**Alcance:** API REST implementada en `CleanArchitecture-G1-fintech-core-app` (Express 5, TypeScript, Prisma 7, PostgreSQL).  
**Fuente de verdad:** únicamente código y pruebas del repositorio backend.  
**Prohibición:** no inventar endpoints, campos, códigos HTTP ni flujos no observados en el código.

---

## 1. Resumen del backend localizado

| Aspecto | Valor observado | Fuente |
|---------|-----------------|--------|
| Raíz del proyecto | `CleanArchitecture-G1-fintech-core-app/` | `package.json` |
| Punto de entrada | `src/server.ts` → `createApp()` | `src/server.ts`, `src/presentation/app.ts` |
| Framework HTTP | Express 5 | `package.json`, `src/presentation/app.ts` |
| Puerto por defecto | `3000` (`process.env.PORT`) | `.env-example`, `src/server.ts` |
| Base URL local | `http://localhost:3000` | `.env-example`, `http/*.http` |
| Prefijo API | `/api` | `src/presentation/app.ts` |
| ORM | Prisma 7 + adapter PostgreSQL | `src/presentation/app.ts`, `prisma/schema.prisma` |
| Validación HTTP | Zod (`validateRequest`) | `src/presentation/middlewares/validateRequest.ts` |
| Autenticación | JWT Bearer (`Authorization: Bearer <token>`) | `src/presentation/middlewares/AuthMiddleware.ts` |
| CORS | Habilitado globalmente (`cors()`) | `src/presentation/app.ts` |

### Estructura de capas (Clean Architecture)

```
src/
├── domain/          # Entidades, excepciones, interfaces de repositorios y servicios
├── use-cases/       # Casos de uso de aplicación + DTOs internos
├── infrastructure/  # Prisma, mappers, Bcrypt, JWT
└── presentation/    # Express app, controllers, DTOs Zod, middlewares
```

**Archivos clave:** `src/presentation/app.ts`, `src/domain/repositories/Repositories.ts`

---

## 2. Envelope de respuesta

### Éxito

```json
{
  "status": "success",
  "data": { }
}
```

Algunos endpoints incluyen además `message` (transacciones, freeze/unfreeze).

**Fuentes:** `AuthController.ts`, `AccountController.ts`, `TransactionController.ts`

### Error

| Campo | Tipo | Observado en |
|-------|------|--------------|
| `status` | `"fail"` \| `"error"` | `ErrorHandler.ts`, `AuthMiddleware.ts`, `validateRequest.ts` |
| `code` | `string` | Todos los handlers de error |
| `message` | `string` | Todos los handlers de error |
| `errors` | `{ field, message }[]` | Solo `VALIDATION_ERROR` (400) |

---

## 3. Tabla de endpoints confirmados

### Auth (públicas)

| Método | Ruta | Auth | Validación Zod | HTTP éxito | Fuente |
|--------|------|------|----------------|------------|--------|
| `POST` | `/api/auth/register` | No | `RegisterUserSchema` | `201` | `app.ts:94`, `AuthController.ts:11-17` |
| `POST` | `/api/auth/login` | No | `LoginSchema` | `200` | `app.ts:95`, `AuthController.ts:23-29` |

#### `POST /api/auth/register`

**Request body** (`src/presentation/dtos/AuthDTOs.ts`):

| Campo | Tipo | Reglas |
|-------|------|--------|
| `name` | `string` | min 3, max 100 |
| `email` | `string` | formato email |
| `password` | `string` | min 8 |

**Response `data`** (`src/use-cases/dto/AuthDTOs.ts`, `RegisterUserUseCase.ts`):

| Campo | Tipo |
|-------|------|
| `id` | `string` (UUID) |
| `name` | `string` |
| `email` | `string` |
| `createdAt` | `Date` (ISO en JSON) |

**Errores observables:**

| Código HTTP | `code` | Condición | Fuente |
|-------------|--------|-----------|--------|
| `400` | `VALIDATION_ERROR` | Body inválido (Zod) | `validateRequest.ts` |
| `500` | `INTERNAL_SERVER_ERROR` | Email duplicado (use case lanza `Error` genérico) | `RegisterUserUseCase.ts:16`, `ErrorHandler.test.ts:131-144` |
| `409` | `DUPLICATE_FIELD` | Conflicto único Prisma P2002 (alternativa posible) | `ErrorHandler.ts:41-47` |

> **Nota:** `UserAlreadyExistsError` existe en dominio y se mapea a `409 USER_ALREADY_EXISTS`, pero `RegisterUserUseCase` no la usa; lanza `Error` genérico.

#### `POST /api/auth/login`

**Request body** (`src/presentation/dtos/AuthDTOs.ts`):

| Campo | Tipo | Reglas |
|-------|------|--------|
| `email` | `string` | formato email |
| `password` | `string` | min 1 (no vacío) |

**Response `data`** (`src/use-cases/dto/AuthDTOs.ts`):

| Campo | Tipo |
|-------|------|
| `token` | `string` (JWT HS256) |
| `user.id` | `string` |
| `user.name` | `string` |
| `user.email` | `string` |

**Errores observables:**

| Código HTTP | `code` | Condición | Fuente |
|-------------|--------|-----------|--------|
| `400` | `VALIDATION_ERROR` | Body inválido | `validateRequest.ts` |
| `500` | `INTERNAL_SERVER_ERROR` | Credenciales inválidas (`Error` genérico) | `LoginUseCase.ts:17,23` |

> **Nota:** `InvalidCredentialsError` → `401 INVALID_CREDENTIALS` está implementado en `ErrorHandler`, pero `LoginUseCase` no la lanza.

---

### Account (protegidas — requieren Bearer token)

| Método | Ruta | Auth | Validación body | HTTP éxito | Fuente |
|--------|------|------|-----------------|------------|--------|
| `GET` | `/api/accounts` | Sí | — | `200` | `app.ts:98` |
| `POST` | `/api/accounts` | Sí | — (sin schema Zod) | `201` | `app.ts:99` |
| `GET` | `/api/accounts/:accountId/balance` | Sí | — | `200` | `app.ts:100` |
| `PATCH` | `/api/accounts/:accountId/freeze` | Sí | — | `200` | `app.ts:101` |
| `PATCH` | `/api/accounts/:accountId/unfreeze` | Sí | — | `200` | `app.ts:102` |

#### `GET /api/accounts`

- **Input:** `userId` extraído del JWT (`req.user.userId`).
- **Response `data`:** array de `AccountOutputDTO`.

**Fuente:** `AccountController.ts:32-44`, `GetUserAccountsUseCase.ts`

#### `POST /api/accounts`

- **Input observado en controller:** solo `{ userId }` del token. **No lee `req.body`.**
- **Response `data`:** objeto `AccountOutputDTO`.

**Fuente:** `AccountController.ts:18-26`, `AccountController.test.ts:72`

> **Discrepancia:** `http/accounts.http` envía `{ "initialBalance": 1000 }`, pero el controller no lo consume. `CreateAccountUseCase` acepta `initialBalance?` opcional, pero no está cableado en presentación.

#### `GET /api/accounts/:accountId/balance`

- **Params:** `accountId` (UUID string).
- **Response `data`:** `AccountOutputDTO` completo (no solo balance).

**Fuente:** `AccountController.ts:47-58`, `GetBalanceUseCase.ts`

#### `PATCH /api/accounts/:accountId/freeze`

- **Response:** `{ status: "success", message: "Cuenta congelada correctamente" }` (sin `data`).

**Fuente:** `AccountController.ts:61-69`

#### `PATCH /api/accounts/:accountId/unfreeze`

- **Response:** `{ status: "success", message: "Cuenta descongelada correctamente" }`.

**Fuente:** `AccountController.ts:75-83`

#### `AccountOutputDTO` (forma de `data`)

| Campo | Tipo en código | Notas JSON |
|-------|----------------|------------|
| `id` | `string?` | UUID |
| `accountNumber` | `string` | formato `ACC-XXXXXXXXX` generado en use case |
| `balance` | `Decimal` (decimal.js) | `[PENDIENTE]` serialización exacta en JSON |
| `status` | `"ACTIVE"` \| `"FROZEN"` | `prisma/schema.prisma`, `Account.ts` |
| `userId` | `string` | UUID del propietario |
| `createdAt` | `Date?` | ISO string en JSON |

**Fuentes:** `src/use-cases/dto/AccountDTOs.ts`, `CreateAccountUseCase.ts:17`, `prisma/schema.prisma`

**Errores comunes Account:**

| Código | `code` | Condición | Fuente |
|--------|--------|-----------|--------|
| `401` | `UNAUTHORIZED` / `INVALID_TOKEN` | Sin token o token inválido | `AuthMiddleware.ts` |
| `404` | `ACCOUNT_NOT_FOUND` | Cuenta inexistente | `ErrorHandler.ts`, `GetBalanceUseCase.ts` |
| `400` | `DOMAIN_VALIDATION_ERROR` | Cuenta ya congelada/activa, etc. | `FreezeAccountUseCase.ts`, `UnfreezeAccountUseCase.ts` |
| `400` | `DOMAIN_VALIDATION_ERROR` | `AccountFrozenError` (cuenta congelada en operación) | `FinancialError.ts`, `ErrorHandler.ts:34-36` |

---

### Transaction (protegidas)

| Método | Ruta | Auth | Validación Zod | HTTP éxito | Fuente |
|--------|------|------|----------------|------------|--------|
| `POST` | `/api/transactions/transfer` | Sí | `TransferMoneySchema` | `201` | `app.ts:105` |
| `POST` | `/api/transactions/deposit` | Sí | `DepositMoneySchema` | `201` | `app.ts:106` |
| `POST` | `/api/transactions/withdrawal` | Sí | `WithdrawalMoneySchema` | `201` | `app.ts:107` |
| `GET` | `/api/transactions/history/:accountId` | Sí | — | `200` | `app.ts:108` |

#### `POST /api/transactions/transfer`

**Request** (`src/presentation/dtos/TransactionDTOs.ts`):

| Campo | Tipo | Reglas |
|-------|------|--------|
| `sourceAccountId` | `string` | UUID |
| `destinationAccountId` | `string` | UUID |
| `amount` | `number` | > 0 |
| `description` | `string` | max 100, opcional |

**Response:** `{ status, message, data }` donde `data` es `TransferMoneyResponse`:

| Campo | Tipo |
|-------|------|
| `transactionId` | `string` |
| `sourceAccountId` | `string` |
| `destinationAccountId` | `string` |
| `amount` | `number` |
| `executedAt` | `Date` |

**Fuente:** `TransactionController.ts:16-24`, `TransferDTOs.ts`

#### `POST /api/transactions/deposit`

**Request:** `{ accountId: uuid, amount: number > 0 }`  
**Response `data`:** `{ accountId, newBalance: number, depositedAt: Date }`

**Fuentes:** `TransactionDTOs.ts`, `DepositDTOs.ts`, `TransactionController.ts:30-37`

#### `POST /api/transactions/withdrawal`

**Request:** `{ accountId: uuid, amount: number > 0 }`  
**Response `data`:** `{ accountId, newBalance: number, withdrawnAt: Date }`

**Fuentes:** `TransactionDTOs.ts`, `WithdrawalDTOs.ts`, `TransactionController.ts:44-51`

#### `GET /api/transactions/history/:accountId`

**Response `data`:**

```typescript
{
  accountId: string;
  transactions: TransactionHistoryItemDTO[];
}
```

**`TransactionHistoryItemDTO`:**

| Campo | Tipo |
|-------|------|
| `id` | `string` |
| `type` | `"DEPOSIT"` \| `"WITHDRAWAL"` \| `"TRANSFER"` |
| `amount` | `number` |
| `status` | `"PENDING"` \| `"COMPLETED"` \| `"FAILED"` |
| `description` | `string` |
| `createdAt` | `Date` |
| `sourceAccountId` | `string?` |
| `destinationAccountId` | `string?` |

**Fuente:** `TransactionHistoryDTOs.ts`, `GetTransactionHistoryUseCase.ts`

**Errores comunes Transaction:**

| Código | `code` | Condición |
|--------|--------|-----------|
| `400` | `VALIDATION_ERROR` | Body inválido (Zod) |
| `400` | `INSUFFICIENT_FUNDS` | Saldo insuficiente |
| `400` | `DOMAIN_VALIDATION_ERROR` | Monto inválido, cuentas iguales, cuenta congelada |
| `404` | `ACCOUNT_NOT_FOUND` | Cuenta no existe |

---

## 4. Códigos de error globales confirmados

| HTTP | `status` | `code` | Origen |
|------|----------|--------|--------|
| 400 | `fail` | `VALIDATION_ERROR` | `validateRequest.ts` |
| 400 | `fail` | `INSUFFICIENT_FUNDS` | `ErrorHandler.ts` |
| 400 | `fail` | `DOMAIN_VALIDATION_ERROR` | `ErrorHandler.ts` (cualquier `DomainError` no mapeado específicamente) |
| 401 | `fail` | `UNAUTHORIZED` | `AuthMiddleware.ts` |
| 401 | `fail` | `INVALID_TOKEN` | `AuthMiddleware.ts` |
| 401 | `fail` | `INVALID_CREDENTIALS` | `ErrorHandler.ts` (clase existe; use case no la usa) |
| 404 | `fail` | `ACCOUNT_NOT_FOUND` | `ErrorHandler.ts` |
| 404 | `fail` | `RESOURCE_NOT_FOUND` | Prisma P2025 |
| 409 | `fail` | `USER_ALREADY_EXISTS` | `ErrorHandler.ts` (clase existe; use case no la usa) |
| 409 | `fail` | `DUPLICATE_FIELD` | Prisma P2002 |
| 500 | `error` | `INTERNAL_SERVER_ERROR` | Errores no controlados |

**Fuente principal:** `src/presentation/middlewares/ErrorHandler.ts`, `tests/middlewares/ErrorHandler.test.ts`

---

## 5. Casos de uso consumidos por el frontend

| Dominio | Caso de uso (backend) | Endpoint(s) |
|---------|----------------------|-------------|
| **Auth** | `RegisterUserUseCase` | `POST /api/auth/register` |
| **Auth** | `LoginUseCase` | `POST /api/auth/login` |
| **Account** | `CreateAccountUseCase` | `POST /api/accounts` |
| **Account** | `GetUserAccountsUseCase` | `GET /api/accounts` |
| **Account** | `GetBalanceUseCase` | `GET /api/accounts/:accountId/balance` |
| **Account** | `FreezeAccountUseCase` | `PATCH /api/accounts/:accountId/freeze` |
| **Account** | `UnfreezeAccountUseCase` | `PATCH /api/accounts/:accountId/unfreeze` |
| **Transaction** | `TransferMoneyUseCase` | `POST /api/transactions/transfer` |
| **Transaction** | `DepositUseCase` | `POST /api/transactions/deposit` |
| **Transaction** | `WithdrawalUseCase` | `POST /api/transactions/withdrawal` |
| **Transaction** | `GetTransactionHistoryUseCase` | `GET /api/transactions/history/:accountId` |

No se encontraron casos de uso adicionales expuestos vía HTTP.

---

## 6. Comandos del backend (para integración local)

| Comando | Script | Fuente |
|---------|--------|--------|
| Instalar deps | `pnpm install` | `package.json` (`devEngines.packageManager: pnpm`) |
| Desarrollo | `pnpm start` → `tsx watch src/server.ts` | `package.json` |
| Compilar | `pnpm build` → `tsc` | `package.json`, `tsconfig.json` |
| Tests | `pnpm test` | `package.json` |
| Tests watch | `pnpm test:watch` | `package.json` |
| Coverage | `pnpm test:coverage` | `package.json` |
| DB local | `docker compose up` | `docker-compose.yml` |
| Variables env | Copiar `.env-example` → `.env` | `.env-example` |

**Variables relevantes para el frontend:**

| Variable | Default observado | Uso |
|----------|-------------------|-----|
| `PORT` | `3000` | URL base del API |
| `JWT_EXPIRES_IN` | `1h` | Duración del token |

---

## 7. Decisiones derivadas para el frontend

1. **Base URL configurable:** `http://localhost:3000` (desarrollo).
2. **Header de auth:** `Authorization: Bearer <token>` en todas las rutas excepto register/login.
3. **Manejar envelope `{ status, data?, message?, code?, errors? }`** de forma uniforme.
4. **No enviar `initialBalance` en create account** hasta que el backend lo cablee (actualmente ignorado).
5. **Tratar errores de login/registro duplicado como `500`** con el código actual, o coordinar fix backend.
6. **No asumir autorización por propiedad de cuenta:** cualquier usuario autenticado puede operar sobre cualquier `accountId` conocido.
7. **Montos:** enviar como `number` JSON; el backend usa `decimal.js` internamente con precisión `@db.Decimal(19, 4)`.

---

## 8. [PENDIENTE]

- [ ] Serialización JSON exacta de `balance` (`Decimal` → string vs number).
- [ ] Confirmar si `description` en transferencia se persiste (Zod la acepta; `TransferMoneyUseCase` genera descripción propia).
- [ ] Endpoint de health check / OpenAPI: **no implementado** en el código analizado.
- [ ] Códigos HTTP reales para registro duplicado y login fallido (gap entre excepciones de dominio y use cases).
- [ ] Política de autorización por `userId` vs `accountId` (no implementada en backend).
- [ ] URL de producción / CORS origins permitidos en despliegue.

---

## 9. Prohibición explícita

**No usar este documento para inferir endpoints, campos o comportamientos no listados arriba.** Cualquier funcionalidad no respaldada por los archivos citados debe marcarse como `[PENDIENTE]` hasta verificación en código o prueba de integración.
