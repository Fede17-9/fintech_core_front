# Comando Agent: Desarrollo de Feature Frontend

Este comando guía al Agent de Cursor AI para implementar una funcionalidad frontend de manera autónoma, metódica y respetando Clean Architecture.

---

## 1. Contexto Requerido
Antes de iniciar cualquier edición, el Agent debe leer explícitamente los siguientes documentos:
- `@docs/frontend/backend-contract.md`
- `@docs/frontend/frontend-architecture.md`
- `@docs/frontend/frontend-state.md`
- `@docs/frontend/frontend-workflows.md`
- `@docs/frontend/frontend-validation.md`

---

## 2. Objetivo
Implementar de extremo a extremo una característica o flujo del frontend (ej. autenticación, gestión de cuentas, depósitos, retiros, transferencias o historial de transacciones), manteniendo aislamiento estricto entre capas y alineación total con el backend.

---

## 3. Alcance de Archivos

### Archivos Permitidos
- `src/domain/**/*` (entidades, repositorios-interfaces, errores)
- `src/application/**/*` (casos de uso)
- `src/infrastructure/**/*` (http, mappers, repositorios-impl, validación)
- `src/presentation/**/*` (componentes, páginas, hooks, rutas)
- Archivos de pruebas unitarias/integración correspondientes (`*.test.ts`, `*.test.tsx`)

### Archivos Fuera de Alcance
- Código del proyecto backend (`CleanArchitecture-G1-fintech-core-app/`)
- Archivos de configuración del entorno que no pertenezcan al frontend
- Documentos de la carpeta `docs/` (solo lectura)

---

## 4. Secuencia de Trabajo Metódica

### Paso 1: Inspección y Alineación
1. Leer los contratos del backend en `@docs/frontend/backend-contract.md` correspondientes a la feature.
2. Identificar los endpoints, DTOs de entrada/salida, códigos HTTP y códigos de error involucrados.
3. Verificar si existen puntos marcados como `[PENDIENTE]` y evitar asumir comportamientos no documentados.

### Paso 2: Diseño y Plan de Capas
1. Definir los tipos/entidades en `src/domain/entities/`.
2. Definir la interfaz del repositorio en `src/domain/repositories/`.
3. Planificar la clase/función del caso de uso en `src/application/`.
4. Definir los esquemas Zod en `src/infrastructure/validation/` espejeando `@docs/frontend/frontend-validation.md`.
5. Diseñar los custom hooks y componentes UI en `src/presentation/`.

### Paso 3: Edición Incremental (De Adentro hacia Afuera)
1. **Capa Domain**: Crear/modificar entidades e interfaces de repositorio.
2. **Capa Infrastructure**: Crear/modificar mappers, schemas Zod e implementación de repositorios con `ApiClient`.
3. **Capa Application**: Implementar el caso de uso sin dependencias de React.
4. **Capa Presentation**: Implementar el custom hook adaptador y los componentes React manejando explícitamente los estados `loading`, `error`, `empty` y `success`.

### Paso 4: Validación de Calidad
1. Verificar que no exista el tipo `any` sin justificación.
2. Verificar que ningún componente instancie `axios`, `fetch` o acceda a `localStorage` directamente.
3. Verificar que ningún archivo en `domain` o `application` importe `react`.
4. Ejecutar el linter y compilador de TypeScript.

### Paso 5: Auditoría Final
Revisar el cumplimiento de las reglas `.cursor/rules/frontend-architecture.mdc`, `frontend-react.mdc` y `frontend-services.mdc`.

---

## 5. Criterios de Aceptación
1. Compilación TypeScript limpia sin errores ni warnings.
2. Separación estricta de capas verificada (cero imports cruzados prohibidos).
3. Cobertura de los 4 estados UI (`loading`, `error`, `empty`, `success`) en la vista/hook.
4. Manejo correcto de errores del servidor mapeando `ApiError` y errores de campo `VALIDATION_ERROR`.
5. Ningún endpoint, DTO o propiedad inventada.

---

## 6. Comandos de Validación
Ejecutar desde la raíz del frontend (según el package manager configurado):
```bash
npm run typecheck || pnpm typecheck || npx tsc --noEmit
npm run lint || pnpm lint
npm test || pnpm test
```

---

## 7. Formato del Reporte Final
Al finalizar la tarea, el Agent debe entregar una síntesis estructurada:
1. **Archivos creados/modificados** por capa (`domain`, `application`, `infrastructure`, `presentation`).
2. **Endpoints consumidos** respaldados por `@docs/frontend/backend-contract.md`.
3. **Verificación de estados UI** (`loading`, `error`, `empty`, `success`).
4. **Resultado de validación de compilación/pruebas**.
