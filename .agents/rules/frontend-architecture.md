# Reglas de Arquitectura Limpia y Contrato de API (Frontend)

## Principios Globales de Arquitectura

1. **Clean Architecture Estricta**:
   - Organización en 4 capas unidireccionales:
     ```
     presentation → application → domain ← infrastructure
     ```
   - **`domain`**: Entidades client-side, interfaces de repositorios, tipos de error. Cero dependencias externas.
   - **`application`**: Casos de uso de cliente (flujos puros). Sin dependencias de React ni HTTP.
   - **`infrastructure`**: Repositorios concretos, `ApiClient`, mappers DTO $\leftrightarrow$ Entidad, `TokenStorage`, esquemas Zod.
   - **`presentation`**: UI en React (páginas, componentes, custom hooks adaptadores, rutas).

2. **Inyección de Dependencias y Composición**:
   - Instanciación de repositorios y casos de uso en un Composition Root (`di.ts` o contenedor).
   - Componentes UI y hooks nunca instancian clientes HTTP o repositorios directamente.

3. **Fidelidad Absoluta al Contrato Backend**:
   - Espejo estricto de [docs/frontend/backend-contract.md](file:///d:/Codigo/DevSeniorAI/CleanArchitecture/CleanArchitecture-G1-fintech-core-front/docs/frontend/backend-contract.md).
   - Prohibido inventar endpoints, propiedades, códigos HTTP o flujos no documentados.

4. **Envelope HTTP y Códigos de Error**:
   - Parsear envelope `{ status, data, message, code, errors }`.
   - Manejar códigos globales: `VALIDATION_ERROR`, `INSUFFICIENT_FUNDS`, `DOMAIN_VALIDATION_ERROR`, `UNAUTHORIZED`, `INVALID_TOKEN`, `ACCOUNT_NOT_FOUND`, `RESOURCE_NOT_FOUND`, `DUPLICATE_FIELD`, `INTERNAL_SERVER_ERROR`.

5. **Marcado de Elementos [PENDIENTE]**:
   - Mantener como `[PENDIENTE]` (sin forzar reglas inventadas) elementos no cableados o ambiguos (`initialBalance`, serialización `Decimal`, auto-login post-registro).

## Referencias
- [backend-contract.md](file:///d:/Codigo/DevSeniorAI/CleanArchitecture/CleanArchitecture-G1-fintech-core-front/docs/frontend/backend-contract.md)
- [frontend-architecture.md](file:///d:/Codigo/DevSeniorAI/CleanArchitecture/CleanArchitecture-G1-fintech-core-front/docs/frontend/frontend-architecture.md)
