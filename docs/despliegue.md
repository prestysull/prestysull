# Publicación gratuita, cuando se autorice

## Recomendación: Cloudflare Pages + repositorio GitHub

Astro produce archivos estáticos en `dist`, sin funciones, base de datos ni adaptador de servidor. Cloudflare Pages ofrece un subdominio `nombre.pages.dev`. La guía oficial indica build `npm run build` y salida `dist`, con nuevas publicaciones al subir commits: [guía Astro de Cloudflare](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/).

La documentación del plan Free consultada el 17/10/2026 indica 500 builds al mes, una compilación concurrente, hasta 20,000 archivos y 25 MiB por archivo. Este sitio pequeño encaja técnicamente en esos límites; confirmar las condiciones vigentes al publicar. No activar funciones o servicios pagados innecesarios. [Límites oficiales](https://developers.cloudflare.com/pages/platform/limits/).

## Pasos

1. Revisar `pendientes.md`, las capturas y la versión de producción local. Obtener aprobación comercial y legal.
2. Crear un repositorio de GitHub vacío (privado si se prefiere). No incluir `.env`, `node_modules`, `dist`, capturas de referencias de terceros ni credenciales. Los recursos originales fuente y el lockfile sí deben conservarse. Los comandos siguientes son instrucciones: no se ejecutó ningún push durante la entrega.

```powershell
git init
git add .
git commit -m "Sitio inicial Prestysull"
git branch -M main
# Reemplazar por la URL real de tu repositorio:
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

3. En Cloudflare: Workers & Pages → crear aplicación → Pages → importar repositorio Git. Conectar solo el repositorio elegido y autorizar en la cuenta del propietario.
4. Rama `main`; comando `npm run build`; directorio `dist`; Node `24` mediante `NODE_VERSION=24`. No se requiere adaptador Cloudflare para este sitio estático.
5. Elegir un nombre disponible. Establecer `SITE_URL=https://NOMBRE_REAL.pages.dev`, `BASE_PATH=/` y inicialmente `PUBLIC_INDEXABLE=false`. No copiar literalmente `NOMBRE_REAL`.
6. Publicar solo con autorización. Revisar las ocho rutas, la 404 con una dirección inexistente, imágenes, cronograma y WhatsApp en el subdominio real.
7. Tras la aprobación final, cambiar `PUBLIC_INDEXABLE=true` y volver a compilar/publicar. Confirmar canónicas, `robots.txt` y `sitemap.xml` con el dominio real. Un preview público con noindex sigue siendo accesible a quien tenga el enlace.
8. Para actualizar: editar datos/código, ejecutar pruebas y build, commit y push. Pages construye una nueva versión automáticamente. Para revertir, restaurar la publicación anterior desde Pages o revertir el commit y volver a publicar.

## Evaluación de GitHub Pages

Técnicamente puede servir el HTML de Astro, con `SITE_URL` y `BASE_PATH` apropiados. Sin embargo, GitHub indica que Pages no está destinado ni permitido como hosting gratuito para operar un negocio en línea o un sitio orientado principalmente a facilitar transacciones comerciales. Dado que Prestysull es un sitio comercial de préstamos, se recomienda Cloudflare Pages y usar GitHub solo para el código. No se instala un workflow de publicación en GitHub Pages. [Restricciones oficiales de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

No se compró dominio, no se creó alojamiento externo y no se realizó despliegue. El subdominio exacto queda pendiente de elección y disponibilidad.
