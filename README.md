# Prestysull — sitio institucional y comercial

Sitio Astro estático con panel editorial Decap CMS en `/admin/`. No tiene cuentas de clientes, formularios de prospectos ni base de datos; WhatsApp sigue siendo el único canal de consulta. El acceso real de Decap Turbo y la publicación automática todavía requieren configuración externa.

## Ejecutar localmente

Requiere Node 22.22 o posterior (verificado en Node 24) y npm.

```powershell
npm ci
npm run dev
```

Abrir http://127.0.0.1:4321. Desarrollo muestra los borradores institucionales y el carrusel de demostración. Ambos se excluyen de producción.

Para revisar el resultado de producción:

```powershell
npm run build
npm run preview
```

Para editar contenido localmente, abre otra terminal y ejecuta `npm run cms`; luego visita `http://127.0.0.1:4321/admin/`.

## Tecnología y estructura

Astro y TypeScript; JSON validado con Zod, Decap CMS, CSS propio, Manrope variable local (SIL Open Font License), SVG para iconos y JavaScript pequeño para interacciones. Sin React, GSAP, formularios de prospectos ni servicios de datos.

```text
src/
  components/             # Botones, tarjetas, FAQ, videos y simulador
  content/cms/            # Textos y medios editables desde /admin/
  data/                   # Adaptadores y reglas protegidas
  layouts/Layout.astro    # Metadatos, encabezado, navegación y footer
  lib/content.ts          # Esquemas y validación del contenido editorial
  lib/finance.ts          # Fórmulas, dinero en céntimos y fechas protegidas
  pages/                  # Ocho páginas + robots.txt y sitemap.xml
  scripts/                # Interacción y scroll
  styles/global.css       # Sistema visual responsive
public/admin/             # Aplicación y configuración Decap
public/uploads/           # Imágenes editables
tests/                    # Pruebas unitarias y de navegador
docs/                     # Auditoría, recursos, pendientes, despliegue y QA
dist/                     # Resultado estático generado con build
```

## Editar contenidos

La administradora usa `/admin/`; no necesita abrir JSON, GitHub ni código. Consulta la [guía de administración](docs/cms-administracion.md) y la [activación de Turbo](docs/cms-turbo-setup.md).

Las fórmulas, tasas, seguro, capital mínimo, límites, periodicidades, máximos de cuotas, feriados, iconos y advertencia financiera permanecen en TypeScript y no aparecen en el CMS. El simulador no envía datos ni usa cookies, localStorage o una base de datos.

## Verificación

```powershell
npm test
npm run check
npm run lint
npm run build
npm run test:e2e
```

El navegador de pruebas usa Edge instalado. En otro equipo, instalar Edge o cambiar `channel` en `playwright.config.ts` y preparar Chromium con `npx playwright install chromium`. El informe HTML se guarda en `playwright-report/`. Las capturas están en `docs/qa/`.

Ver [verificación del CMS](docs/cms-verificacion.md), [resultados generales](docs/verificacion.md), [pendientes](docs/pendientes.md), [publicación gratuita](docs/despliegue.md), [auditoría](docs/auditoria-visual.md) y [recursos originales](docs/recursos.md).

## Estado de publicación

La indexación está desactivada por defecto. `SITE_URL` está vacío para no inventar un dominio. Al definirlo se generan canónicas y entradas del sitemap. Activar `PUBLIC_INDEXABLE=true` solo después de la revisión comercial, financiera y legal. Noindex es una instrucción para buscadores, no una restricción de acceso: no subir contenido confidencial.
