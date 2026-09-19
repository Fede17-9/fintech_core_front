---
name: frontend-api-contract
description: Workflow de verificación de contratos API para validar que los DTOs, mappers y endpoints del frontend coinciden 100% con el backend.
---

# Skill: Verificación de Contrato API (Backend $\rightarrow$ Frontend)

Este skill define el proceso para auditar y validar la sincronización entre el cliente frontend y la API backend documentada.

## Workflow de Verificación

### 1. Lectura del Contrato Base
- Leer `docs/frontend/backend-contract.md` y `docs/frontend/frontend-validation.md`.
- Extraer las firmas exactas de los endpoints, DTOs y reglas Zod.

### 2. Inspección de Rutas y Encabezados HTTP
- Comprobar que `ApiClient` prefije las peticiones con la URL base configurable (`VITE_API_URL` o `http://localhost:3000`).
- Comprobar que las rutas protegidas agreguen el encabezado `Authorization: Bearer <token>`.

### 3. Validación de DTOs y Mappers
- Verificar que los esquemas Zod en cliente coincidan en longitud, min/max, formatos de email y UUID con los del backend.
- Verificar que los mappers transformen adecuadamente los tipos `AccountOutputDTO` y `TransactionHistoryItemDTO`.

### 4. Normalización de Errores
- Confirmar la captura de respuestas con error `{ status, code, message, errors }`.
- Confirmar el mapeo de los códigos de error globales: `VALIDATION_ERROR`, `INSUFFICIENT_FUNDS`, `DOMAIN_VALIDATION_ERROR`, `UNAUTHORIZED`, `INVALID_TOKEN`, `ACCOUNT_NOT_FOUND`, `RESOURCE_NOT_FOUND`, `DUPLICATE_FIELD`, `INTERNAL_SERVER_ERROR`.

### 5. Reporte de Desviaciones
- Reportar cualquier campo o endpoint no respaldado por el backend como una desviación o marcarlo como `[PENDIENTE]`.
