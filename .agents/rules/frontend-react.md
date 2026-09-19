# Reglas para Componentes React y Presentation Layer (Antigravity)

## Componentes y Hooks en Presentation

1. **Sin Infraestructura Directa**:
   - Componentes React (`.tsx`) prohibidos de importar `axios`, ejecutar `fetch`, manipular JWT o `localStorage` directamente.
   - Toda interacción pasa por la capa `application` y custom hooks.

2. **Custom Hooks Adaptadores**:
   - Encapsulan suscripción a estado e invocación de use cases en `src/application/`.

3. **Manejo Obligatorio de 4 Estados UI**:
   - **`loading`**: Indicador visual o deshabilitación de submit.
   - **`error`**: Mapeo de `ApiError` y `errors[]` por campo en formularios.
   - **`empty`**: Feedback cuando arreglos/colecciones estén vacíos.
   - **`success`**: Renderizado de datos o confirmación visual.

4. **Separación de Estado**:
   - **Local**: Formularios, UI toggles (`useState`).
   - **Sesión**: Token JWT + user (`AuthSession`).
   - **Remoto**: Datos de cuentas y transacciones via use cases/cache.

## Referencias
- [frontend-architecture.md](file:///d:/Codigo/DevSeniorAI/CleanArchitecture/CleanArchitecture-G1-fintech-core-front/docs/frontend/frontend-architecture.md)
- [frontend-state.md](file:///d:/Codigo/DevSeniorAI/CleanArchitecture/CleanArchitecture-G1-fintech-core-front/docs/frontend/frontend-state.md)
