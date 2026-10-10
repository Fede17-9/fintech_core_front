# Revisar el diseño localmente

Los cambios son de presentación: estilos, navegación, login, registro y panel.
Los repositorios, casos de uso y llamadas a la API conservan su comportamiento.

## Conservar la base de datos que ya está corriendo

Para revisar este cambio no necesitas levantar `fintech-infra` ni reconstruir
las imágenes Docker. Usa la base actual y ejecuta las aplicaciones localmente.
Necesitas Node.js y pnpm disponibles en tus terminales.

1. Abre una terminal en la raíz de `PROYECTO` y ejecuta:

   ```powershell
   cd .\fintech-core-app
   pnpm dev
   ```

   La variable `DATABASE_URL` de `fintech-core-app/.env` debe apuntar al puerto
   publicado de tu PostgreSQL, usando `localhost` como host para ejecución local.
   No uses `postgres-db` como host fuera de la red de Docker.
   Si tu base ya funcionaba con el backend local, conserva esos valores.

2. En otra terminal, también desde `PROYECTO`, ejecuta:

   ```powershell
   cd .\fintetch-core-front
   pnpm dev
   ```

   El `.env` de esta carpeta debe tener `VITE_API_URL=http://localhost:3000`
   si tu backend usa el puerto 3000. Si Vite elige otro puerto por estar ocupado
   el 5173, abre la URL que muestre la terminal.

3. Abre http://localhost:5173/login. Revisa los colores, el formulario y la
   navegación a registro. Estas pantallas pueden verse sin backend, aunque
   iniciar sesión y registrar usuarios requieren que la API funcione.

4. Registra un usuario de prueba o entra con uno existente. En el panel revisa
   el resumen, las tarjetas de cuentas, los botones y los formularios de
   depósito, retiro y transferencia. Las acciones sí operan sobre la base
   conectada; usa cuentas y montos de prueba.

5. Reduce el ancho de la ventana para comprobar el diseño móvil. Comprueba
   que los botones se acomodan, que puedes leer los saldos y que los modales
   permiten desplazarte. Usa Tab para comprobar los indicadores de foco.

6. Para terminar, presiona `Ctrl+C` en las dos terminales. Tu contenedor de
   PostgreSQL seguirá funcionando. Vite muestra automáticamente los cambios
   posteriores de estilos y componentes mientras siga ejecutándose.

Si aparecen errores de tablas inexistentes, la base podría necesitar las
migraciones. Confirma primero a qué base apunta `DATABASE_URL`; aplicar
`pnpm exec prisma migrate deploy` modifica el esquema de esa base.

## Probar después con todo en Docker

Cuando quieras probar el empaquetado completo, detén los procesos locales
y resuelve los puertos ocupados por los contenedores anteriores. Desde
`fintech-infra`, `docker compose up -d --build` reconstruye el frontend.
La URL del frontend será http://localhost:8080 con los valores actuales.
Ese stack usa un volumen propio: no comparte automáticamente los usuarios
ni cuentas de tu PostgreSQL anterior.
