---
name: frontend-feature
description: Workflow metódico de 5 pasos para implementar características frontend con Clean Architecture en Antigravity.
---

# Skill: Desarrollo de Features Frontend (Clean Architecture)

Instrucciones para implementar características frontend respetando Clean Architecture.

## Workflow de 5 Pasos

### 1. Inspección
- Leer `docs/frontend/backend-contract.md`, `frontend-architecture.md`, `frontend-state.md`, `frontend-workflows.md` y `frontend-validation.md`.
- Confirmar endpoints, DTOs y códigos de error. Identificar elementos `[PENDIENTE]`.

### 2. Plan de Capas
- `domain`: Entidades, interfaces de repositorio y errores.
- `infrastructure`: Mappers DTO $\leftrightarrow$ Entidad, schemas Zod espejo, `ApiClient`, repositorios HTTP.
- `application`: Casos de uso puros TypeScript.
- `presentation`: Custom hooks adaptadores y componentes React.

### 3. Edición Incremental
- `src/domain/` $\rightarrow$ `src/infrastructure/` $\rightarrow$ `src/application/` $\rightarrow$ `src/presentation/`.
- Cobertura explícita de estados UI: `loading`, `error`, `empty`, `success`.

### 4. Validación
- TypeScript estricto (`tsc --noEmit`), cero `any`, desempaquetado de envelope.

### 5. Auditoría
- Aislamiento de capas, sin imports prohibidos.
