# Reglas para Servicios, Casos de Uso e Infraestructura (Antigravity)

## Dominio, Aplicación e Infraestructura

1. **Aislamiento Total de React**:
   - Cero imports de `react` o `react-dom` en `src/domain/`, `src/application/` o `src/infrastructure/`.

2. **TypeScript Estricto**:
   - Prohibido el uso de `any`. Tipado explícito con interfaces, genéricos o `unknown` con type guards.

3. **ApiClient y Envelope**:
   - URL base configurable (`VITE_API_URL` o `http://localhost:3000`).
   - Inyección de `Authorization: Bearer <token>`.
   - Desempaquetado de envelope `data` y mapeo de `ApiError`.

4. **Esquemas Zod Espejo**:
   - Replicar reglas Zod de [docs/frontend/frontend-validation.md](file:///d:/Codigo/DevSeniorAI/CleanArchitecture/CleanArchitecture-G1-fintech-core-front/docs/frontend/frontend-validation.md) (`RegisterUserSchema`, `LoginSchema`, `TransferMoneySchema`, `DepositMoneySchema`, `WithdrawalMoneySchema`).

5. **Sin Replicación Financiera**:
   - Delegar validaciones financieras avanzadas al backend; no calcular saldos ni verificar estados congelados localmente como sustituto de la llamada HTTP.

## Referencias
- [backend-contract.md](file:///d:/Codigo/DevSeniorAI/CleanArchitecture/CleanArchitecture-G1-fintech-core-front/docs/frontend/backend-contract.md)
- [frontend-validation.md](file:///d:/Codigo/DevSeniorAI/CleanArchitecture/CleanArchitecture-G1-fintech-core-front/docs/frontend/frontend-validation.md)
