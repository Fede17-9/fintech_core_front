# Comando Agent: Auditoría de Calidad y Cumplimiento Arquitectónico Frontend

Este comando ejecuta una auditoría integral sobre la base de código del frontend para garantizar el cumplimiento estricto de las reglas de arquitectura, TypeScript, aislamiento de dominio y gestión de estado.

---

## 1. Contexto Requerido
- `@docs/frontend/frontend-architecture.md`
- `@docs/frontend/frontend-state.md`

---

## 2. Objetivo
Auditar el código frontend identificando violaciones de Clean Architecture, uso ilegítimo de `any`, fugas de infraestructura hacia la vista, ausencia de estados UI requeridos y acoplamiento indebido.

---

## 3. Lista de Comprobación de Auditoría

### 3.1 Auditoría de Dependencias de Capas
- [ ] ¿Existe algún import de `presentation` o `infrastructure` dentro de `domain`? $\rightarrow$ **VIOLACIÓN**
- [ ] ¿Existe algún import de `react` o hooks de React en `domain`, `application` o `infrastructure`? $\rightarrow$ **VIOLACIÓN**
- [ ] ¿Existe algún import de `axios`, `fetch` o `localStorage` directamente dentro de componentes React en `presentation/`? $\rightarrow$ **VIOLACIÓN**

### 3.2 Auditoría de TypeScript y Tipado
- [ ] ¿Existe alguna declaración `: any`, `as any` o cast no justificado? $\rightarrow$ **VIOLACIÓN**
- [ ] ¿Están todas las funciones y componentes tipados explícitamente?

### 3.3 Auditoría de Cobertura de Estados UI
- [ ] Para cada vista o hook con operaciones asíncronas, ¿se gestionan explícitamente `loading`, `error`, `empty` y `success`? $\rightarrow$ **REQUERIDO**
- [ ] ¿Se muestran los errores de formulario mapeados por campo (`VALIDATION_ERROR`)?

### 3.4 Auditoría de Estado y Persistencia
- [ ] ¿La sesión (`token`, `user`) está aislada en el estado global de autenticación?
- [ ] ¿Se evita duplicar estado remoto mutable en estado de componente local?
- [ ] ¿Se evita implementar reglas financieras complejas en el cliente?

---

## 4. Secuencia de Auditoría

1. **Búsqueda de Violaciones de Imports**:
   - Analizar los imports en `src/domain/` y `src/application/`.
   - Analizar los imports en `src/presentation/`.
2. **Búsqueda de `any`**:
   - Ejecutar inspección o linter para detectar usos de `any`.
3. **Revisión de Vistas e Interacción Async**:
   - Inspeccionar componentes y hooks para confirmar el manejo de los 4 estados UI (`loading`, `error`, `empty`, `success`).
4. **Validación de Compilación**:
   - Ejecutar verificación de tipos TypeScript sin emisió de código.

---

## 5. Formato del Reporte de Auditoría
El reporte debe clasificarse en:
- 🔴 **Violaciones Críticas**: Imports prohibidos, uso de `any`, infraestructura en componentes.
- 🟡 **Advertencias**: Estados UI faltantes, tipos imprecisos, mapeo parcial de errores.
- 🟢 **Conformidades**: Capas limpias, DTOs mapeados, TypeScript estricto.
