# Verificación del CMS

## Probado localmente

- Los siete archivos JSON se validan con esquemas estrictos.
- El contenido inválido, las URLs sin HTTPS y las rutas fuera de `/uploads/` detienen las pruebas o la compilación.
- `/admin/` y `/admin/config.yml` se copian al sitio estático.
- Decap CMS está fijado en la versión 3.17.3.
- El hero usa tres imágenes editables y conserva teclado, gesto táctil y movimiento reducido.
- La sección de videos desaparece por completo cuando está desactivada o vacía.
- El sitio conserva el cálculo financiero obligatorio y sus pruebas automatizadas.
- La compilación funciona en la raíz y con `BASE_PATH=/revision/`.

Matriz ejecutada el 30 de octubre de 2026: 26/26 pruebas unitarias, 0 diagnósticos de Astro, lint limpio, build estático correcto y 23/23 pruebas Playwright aprobadas. `npm audit --omit=dev` reportó 0 vulnerabilidades de producción.

## Bloqueado por configuración externa

- Inicio de sesión real con Decap Turbo: falta crear el sitio y obtener `turbo_site_id`.
- Edición desde otro lugar: depende del acceso Turbo y de una URL pública definitiva.
- Publicación automática: falta autorizar la integración en `main` y conectar el hosting.

## No verificado

- El plan gratuito y sus límites no se han probado con una cuenta real de Prestysull.
- No se ha guardado contenido real desde Turbo.
- No se ha comprobado un despliegue disparado por un commit editorial.
- `npm audit` reporta vulnerabilidades transitivas en herramientas locales de desarrollo (`decap-server` y lint). No afectan el bundle público; la corrección automática completa propone versiones regresivas o incompatibles y queda pendiente de actualizaciones upstream.

## Pendiente antes de producción

1. Reemplazar el marcador `REPLACE_WITH_TURBO_SITE_ID`.
2. Restringir la aplicación GitHub de Turbo al repositorio indicado.
3. Autorizar y revisar la integración en `main`.
4. Configurar el hosting gratuito y ejecutar una prueba completa de guardar, publicar y revertir.
5. Revisar comercial y legalmente los textos institucionales y financieros.
