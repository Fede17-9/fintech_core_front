---
name: frontend-api-contract
description: Workflow de verificación de contratos API backend -> frontend para Antigravity.
---

# Skill: Verificación de Contrato API (Backend $\rightarrow$ Frontend)

Instrucciones para auditar la fidelidad de DTOs, mappers y endpoints contra el backend.

## Workflow

1. Leer `docs/frontend/backend-contract.md` y `docs/frontend/frontend-validation.md`.
2. Verificar URLs base y encabezados `Authorization: Bearer <token>`.
3. Validar schemas Zod espejo (Auth, Transaction) y mappers `AccountOutputDTO`, `TransactionHistoryItemDTO`.
4. Verificar desempaquetado de envelope `{ status, data, message, code, errors }`.
5. Reportar desviaciones o marcar puntos `[PENDIENTE]`.
