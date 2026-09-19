# Validación Frontend (espejo del backend)

**Fecha del análisis:** 16 de septiembre de 2026  
**Alcance:** Reglas de validación observadas en schemas Zod (presentation) y entidades de dominio backend.  
**Prohibición:** no añadir reglas no respaldadas por el código backend analizado.

---

## 1. Estrategia de validación

El backend valida en dos niveles:

| Nivel | Ubicación | Responsabilidad |
|-------|-----------|-----------------|
| **Borde HTTP** | `src/presentation/dtos/*.ts` + `validateRequest.ts` | Formato, tipos, rangos básicos |
| **Dominio / aplicación** | `src/domain/entities/*.ts`, `src/use-cases/*.ts` | Reglas de negocio (saldo, estado FROZEN, etc.) |

**Decisión derivada para frontend:**

1. **Validación de formularios:** replicar reglas Zod del backend para feedback inmediato (fail-fast UX).
2. **Validación de negocio:** confiar en respuestas `400`/`404` del backend; no duplicar lógica compleja (p. ej. saldo insuficiente en tiempo real sin consultar API).
3. **Mensajes:** usar textos del backend cuando existan (`errors[].message`, `message`).

**Fuentes:** `validateRequest.ts`, `ErrorHandler.ts`

---

## 2. Schemas Zod confirmados (presentation layer)

### 2.1 Register — `RegisterUserSchema`

**Archivo:** `src/presentation/dtos/AuthDTOs.ts`

| Campo | Regla Zod | Mensaje de error (observado) |
|-------|-----------|------------------------------|
| `name` | `string`, required | "El nombre completo es requerido" |
| `name` | min 3 | "El nombre completo debe tener al menos 3 caracteres" |
| `name` | max 100 | "El nombre completo no puede exceder 100 caracteres" |
| `email` | email | "Formato de correo electrónico inválido" |
| `password` | string, required | "La contraseña es requerida" |
| `password` | min 8 | "La contraseña debe tener mínimo 8 caracteres" |

**Respuesta error:** `400 VALIDATION_ERROR` con `errors: [{ field, message }]`

### 2.2 Login — `LoginSchema`

**Archivo:** `src/presentation/dtos/AuthDTOs.ts`

| Campo | Regla Zod | Mensaje |
|-------|-----------|---------|
| `email` | email | "Formato de correo electrónico inválido" |
| `password` | string, required | "La contraseña es requerida" |
| `password` | min 1 | "La contraseña no puede estar vacía" |

### 2.3 Transfer — `TransferMoneySchema`

**Archivo:** `src/presentation/dtos/TransactionDTOs.ts`

| Campo | Regla Zod | Mensaje |
|-------|-----------|---------|
| `sourceAccountId` | uuid | "ID de cuenta de origen debe ser un UUID válido" |
| `destinationAccountId` | uuid | "ID de cuenta de destino debe ser un UUID válido" |
| `amount` | number, required | "El monto es requerido" |
| `amount` | positive | "El monto a transferir debe ser un número estrictamente mayor a cero" |
| `description` | string, max 100, optional | "La descripción no puede exceder los 100 caracteres" |

### 2.4 Deposit — `DepositMoneySchema`

| Campo | Regla | Mensaje |
|-------|-------|---------|
| `accountId` | uuid | "ID de cuenta debe ser un UUID válido" |
| `amount` | number, positive | "El monto a depositar debe ser un número estrictamente mayor a cero" |

### 2.5 Withdrawal — `WithdrawalMoneySchema`

| Campo | Regla | Mensaje |
|-------|-------|---------|
| `accountId` | uuid | "ID de cuenta debe ser un UUID válido" |
| `amount` | number, positive | "El monto a retirar debe ser un número estrictamente mayor a cero" |

---

## 3. Validaciones sin schema Zod en HTTP

### 3.1 Crear cuenta — `POST /api/accounts`

- **No hay `validateRequest`** en la ruta.
- Controller solo pasa `{ userId }` del token.
- `CreateAccountUseCase` acepta `initialBalance?` pero no está expuesto.

**Decisión frontend:** no validar body en create account (body opcional/vacío).

**Fuente:** `app.ts:99`, `AccountController.ts:18-21`

### 3.2 Rutas con `:accountId` en path

- Validación de formato UUID **no observada** en middleware para params.
- Use cases buscan por ID; IDs inválidos probablemente resulten en `404 ACCOUNT_NOT_FOUND`.

**[PENDIENTE]:** comportamiento exacto con UUID malformado.

**Fuente:** `AccountController.ts`, `GetBalanceUseCase.ts`

---

## 4. Reglas de dominio (backend) relevantes para UX

Estas reglas **no están en Zod** pero el frontend debe anticipar errores:

| Regla | Error backend | HTTP | Fuente |
|-------|---------------|------|--------|
| Saldo insuficiente | `InsufficientBalanceError` | 400 `INSUFFICIENT_FUNDS` | `WithdrawalUseCase.ts`, `TransferMoneyUseCase.ts` |
| Cuenta congelada | `AccountFrozenError` | 400 `DOMAIN_VALIDATION_ERROR` | `DepositUseCase.ts`, `Account.ts` |
| Cuenta no existe | `AccountNotFoundError` | 404 `ACCOUNT_NOT_FOUND` | Varios use cases |
| Monto ≤ 0 (dominio) | `InvalidAmountError` | 400 `DOMAIN_VALIDATION_ERROR` | `InvalidAmountError` extends `DomainError` |
| Origen = destino (transfer) | `InvalidPropValueError` | 400 `DOMAIN_VALIDATION_ERROR` | `TransferMoneyUseCase.ts:19-21` |
| Cuenta ya congelada | `AccountFrozenError` / `InvalidPropValueError` | 400 | `FreezeAccountUseCase.ts`, `Account.ts` |
| Cuenta ya activa (unfreeze) | `InvalidPropValueError` | 400 | `UnfreezeAccountUseCase.ts` |
| Email duplicado (register) | `Error` genérico | 500 | `RegisterUserUseCase.ts:16` |
| Credenciales inválidas (login) | `Error` genérico | 500 | `LoginUseCase.ts:17,23` |

### 4.1 Validación adicional en entidad User (dominio)

**Archivo:** `src/domain/entities/User.ts`

- Email validado con regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` en `User.create()`.
- Zod ya valida email en presentation; capa dominio es redundante en flujo HTTP normal.

### 4.2 Validación adicional en entidad Account

**Archivo:** `src/domain/entities/Account.ts`

- Balance inicial no negativo en `Account.create()`.
- Operaciones `deposit`/`withdraw` rechazan montos ≤ 0 y cuenta `FROZEN`.

---

## 5. Formato de error de validación (contrato)

```json
{
  "status": "fail",
  "code": "VALIDATION_ERROR",
  "message": "Error de validación en los datos de entrada",
  "errors": [
    { "field": "email", "message": "Formato de correo electrónico inválido" }
  ]
}
```

**Fuente:** `validateRequest.ts:12-19`, `tests/middlewares/validateRequest.test.ts`

**Decisión frontend:** mapear `field` a nombres de input del formulario (misma convención que backend).

---

## 6. Propuesta de schemas frontend (espejo Zod)

En Prompt 2, crear schemas en `src/infrastructure/validation/` o `src/presentation/validation/` copiando reglas de:

- `src/presentation/dtos/AuthDTOs.ts`
- `src/presentation/dtos/TransactionDTOs.ts`

**Recomendación:** importar mensajes idénticos para consistencia UX con respuestas del servidor.

Ejemplo estructural (no implementar aún):

```typescript
// Espejo de RegisterUserSchema — reglas confirmadas en AuthDTOs.ts
const registerUserSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.email(),
  password: z.string().min(8),
});
```

---

## 7. Validaciones UI adicionales (solo UX, no backend)

Permitidas si no contradicen el backend:

| Validación UI | Justificación |
|---------------|---------------|
| Confirmar password en register | UX; backend no la pide |
| Deshabilitar submit si cuenta origen = destino | Anticipa `DOMAIN_VALIDATION_ERROR` |
| Deshabilitar ops en cuentas `FROZEN` | Anticipa error de dominio |
| Formato numérico de monto (decimales) | Backend usa `Decimal(19,4)` — `[PENDIENTE]` max decimales |

**No permitido:** inventar campos obligatorios no presentes en schemas backend.

---

## 8. Tipos y coerción

| Aspecto | Backend | Frontend |
|---------|---------|----------|
| Montos en JSON | `number` | Input text → parseFloat/Decimal |
| UUIDs | string uuid | Select de cuentas propias → UUID válido |
| Fechas | `Date` → ISO string en JSON | `new Date(isoString)` |
| Enums | string literals | Union types TS |

**Fuente:** DTOs en `src/use-cases/dto/`, schemas Zod

---

## 9. Matriz de validación por pantalla (derivada)

| Pantalla (futura) | Validación cliente (Zod espejo) | Validación servidor |
|-------------------|--------------------------------|---------------------|
| Register | `RegisterUserSchema` | 400 / 500 |
| Login | `LoginSchema` | 400 / 500 |
| Create account | ninguna | 401 |
| Deposit | `DepositMoneySchema` | 400 / 404 |
| Withdraw | `WithdrawalMoneySchema` | 400 / 404 |
| Transfer | `TransferMoneySchema` | 400 / 404 |
| Freeze/Unfreeze | UUID en ruta (opcional UI) | 404 / 400 |

---

## 10. [PENDIENTE]

- [ ] Validar si montos con más de 4 decimales son truncados o rechazados.
- [ ] Comportamiento con `amount` como string en JSON (Zod espera number).
- [ ] Unificar códigos de error auth (500 vs 401/409 esperados por dominio).
- [ ] Exponer `initialBalance` en create account con schema Zod (requiere cambio backend).

---

## 11. Prohibición explícita

No agregar reglas de validación (longitudes, regex, campos requeridos) que no aparezcan en `src/presentation/dtos/*.ts` o entidades/use cases citados. Ante duda, marcar `[PENDIENTE]`.
