# Activación gratuita de Decap Turbo

Estos pasos todavía requieren intervención del propietario de Prestysull. No introduzcas contraseñas, tokens ni claves dentro del repositorio.

1. Crea una organización gratuita en Decap Turbo y confirma que el plan muestra **1 sitio** y **1 asiento**.
2. Conecta la aplicación GitHub de Turbo limitando el acceso únicamente al repositorio `prestysull/prestysull`.
3. Crea un sitio y registra la dirección pública exacta del administrador, terminada en `/admin/`.
4. Copia el UUID público `turbo_site_id` entregado por Turbo.
5. En `public/admin/config.yml`, sustituye `REPLACE_WITH_TURBO_SITE_ID` por ese UUID. No cambies `backend.name: turbo-github` ni `branch: main`.
6. Conserva un solo administrador y prueba el inicio de sesión en una ventana privada.

## Publicación pendiente

La implementación CMS está en `codex/decap-cms-implementation`. Antes de que una edición pueda publicarse se necesita autorización para:

1. integrar esta rama en `main`;
2. conectar el proveedor gratuito de hosting con `prestysull/prestysull`;
3. configurar `npm ci` y `npm run build`;
4. probar un cambio editorial controlado y su reversión.

La URL del sitio, el UUID real y el despliegue no deben considerarse configurados hasta comprobar los cuatro puntos.

## Desarrollo local

En dos terminales separadas:

```powershell
npm run dev
npm run cms
```

Abre `http://127.0.0.1:4321/admin/`. El proxy local modifica el checkout; no prueba la autenticación de Turbo ni el despliegue público.
