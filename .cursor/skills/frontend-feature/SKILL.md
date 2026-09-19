---
name: frontend-feature
description: Workflow metódico de 5 pasos (inspección, plan, edición incremental, validación y auditoría) para implementar características frontend alineadas con Clean Architecture.
---

# Skill: Desarrollo de Features Frontend (Clean Architecture)

Este skill define el proceso estricto de 5 pasos para construir o modificar funcionalidades en el frontend.

## Workflow de 5 Pasos

### 1. Inspección de Requisitos y Contratos
- Leer los documentos de especificación en `docs/frontend/` (`backend-contract.md`, `frontend-architecture.md`, `frontend-state.md`, `frontend-workflows.md`, `frontend-validation.md`).
- Verificar en `docs/frontend/backend-contract.md` los endpoints, DTOs de entrada/salida, códigos de respuesta HTTP y códigos de error esperados.
- Identificar elementos `[PENDIENTE]` (ej. `initialBalance`, serialización de `balance`, auto-login) y no forzar comportamientos no respaldados.

### 2. Planificación de Capas
Diseñar la solución respetando las 4 capas de Clean Architecture:
- **`domain`**: Definir tipos, entidades client-side e interfaces de repositorios.
- **`infrastructure`**: Planificar mappers DTO $\leftrightarrow$ Entidad, clientes HTTP (`ApiClient`), esquemas Zod Espejo y repositorios concretos.
- **`application`**: Diseñar los casos de uso puros TypeScript.
- **`presentation`**: Planificar hooks adaptadores y componentes React declarativos.

### 3. Edición Incremental
Ejecutar los cambios en orden de adentro hacia afuera:
1. `src/domain/`: Crear/actualizar entidades y contratos de repositorio.
2. `src/infrastructure/`: Implementar mappers, esquemas de validación Zod y repositorios HTTP.
3. `src/application/`: Implementar los casos de uso consumiendo las interfaces del dominio.
4. `src/presentation/`: Crear los hooks adaptadores y componentes UI gestionando obligatoriamente los 4 estados: `loading`, `error`, `empty` y `success`.

### 4. Validación de Calidad
- Ejecutar la verificación de tipos de TypeScript (`tsc --noEmit`).
- Asegurar que no existan variables de tipo `any`.
- Verificar que las llamadas HTTP desempaqueten el envelope `{ status: "success", data }` y capturen `ApiError`.

### 5. Auditoría de Cumplimiento
- Confirmar que ningún componente React consuma `axios`, `fetch` o `localStorage` directamente.
- Confirmar que ninguna clase/función en `domain` o `application` importe elementos de React.
- Confirmar que no se hayan inventado endpoints ni propiedades.
