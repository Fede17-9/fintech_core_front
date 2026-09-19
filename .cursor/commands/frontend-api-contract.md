# Comando Agent: Verificación de Contrato API Backend $\rightarrow$ Frontend

Este comando ejecuta una verificación estricta de alineación entre los DTOs, mappers, endpoints y clientes del frontend frente al contrato del backend.

---

## 1. Contexto Requerido
- `@docs/frontend/backend-contract.md`
- `@docs/frontend/frontend-validation.md`

---

## 2. Objetivo
Garantizar que todo el código del frontend (módulos HTTP, mappers, DTOs y validaciones) sea 100% fiel al contrato técnico del backend expuesto en `@docs/frontend/backend-contract.md`, detectando disonancias, campos inventados o códigos HTTP incorrectos.

---

## 3. Alcance de Archivos

### Archivos Permitidos
- `src/infrastructure/http/**/*`
- `src/infrastructure/mappers/**/*`
- `src/infrastructure/validation/**/*`
- `src/domain/entities/**/*`
- `src/domain/errors/**/*`

### Archivos Fuera de Alcance
- Vistas React (`src/presentation/components/**/*`, `src/presentation/pages/**/*`)
- Repositorio backend

---

## 4. Secuencia de Trabajo Metódica

### Paso 1: Auditoría de Rutas y Métodos HTTP
Comprobar en `infrastructure/http/` o repositorios concretos que cada llamada HTTP coincida exactamente con la tabla de endpoints confirmados:
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Account: `GET /api/accounts`, `POST /api/accounts`, `GET /api/accounts/:accountId/balance`, `PATCH /api/accounts/:accountId/freeze`, `PATCH /api/accounts/:accountId/unfreeze`
- Transaction: `POST /api/transactions/transfer`, `POST /api/transactions/deposit`, `POST /api/transactions/withdrawal`, `GET /api/transactions/history/:accountId`

### Paso 2: Auditoría de Request Bodies y Schemas Zod
Comparar los esquemas Zod en `infrastructure/validation/` con los DTOs backend en `@docs/frontend/frontend-validation.md`:
- `RegisterUserSchema`: `name` (min 3, max 100), `email` (email), `password` (min 8).
- `LoginSchema`: `email` (email), `password` (min 1).
- `TransferMoneySchema`: `sourceAccountId` (uuid), `destinationAccountId` (uuid), `amount` (number > 0), `description` (optional max 100).
- `DepositMoneySchema`: `accountId` (uuid), `amount` (number > 0).
- `WithdrawalMoneySchema`: `accountId` (uuid), `amount` (number > 0).

### Paso 3: Desempaquetado de Envelope y Mappers
- Confirmar que `ApiClient` desempaqueta `{ status: "success", data, message }` y extrae `data`.
- Verificar que `ErrorMapper` / `ApiClient` procese las respuestas de error `{ status, code, message, errors }`.
- Confirmar que se reconozcan los códigos de error globales: `VALIDATION_ERROR`, `INSUFFICIENT_FUNDS`, `DOMAIN_VALIDATION_ERROR`, `UNAUTHORIZED`, `INVALID_TOKEN`, `ACCOUNT_NOT_FOUND`, `RESOURCE_NOT_FOUND`, `DUPLICATE_FIELD`, `INTERNAL_SERVER_ERROR`.

### Paso 4: Marcado de Inconsistencias o [PENDIENTE]
Si se detecta cualquier intento de usar campos o comportamientos no respaldados (ej. enviar `initialBalance` en POST `/api/accounts`, asumir token en registro, asumir logout server-side), marcarlo como `[PENDIENTE]` o inconsistencia.

---

## 5. Criterios de Aceptación
1. Ningún endpoint, parámetro de query o body contiene campos ajenos al contrato backend.
2. Todos los encabezados de autorización usan `Authorization: Bearer <token>` en rutas protegidas.
3. Los mappers mapean adecuadamente `AccountOutputDTO` y `TransactionHistoryItemDTO` a tipos de dominio.
4. Cero tipos `any` en los mappers o DTOs.

---

## 6. Comandos de Validación
```bash
npm run typecheck || pnpm typecheck || npx tsc --noEmit
npm test || pnpm test
```

---

## 7. Formato del Reporte Final
1. **Tabla de comprobación de Endpoints**: Método, Ruta, Auth Header, Estado de Verificación.
2. **Tabla de Schemas Zod Espejo**: Nombre de Schema, Estado de Cumplimiento.
3. **Lista de Inconsistencias o Elementos [PENDIENTE]**.
