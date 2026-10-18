# Prestysull — sitio institucional y comercial

Sitio estático de revisión, sin backend, cuentas ni captación de datos. Consulta por WhatsApp al número oficial. No se ha publicado ni conectado un repositorio externo.

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

## Tecnología y estructura

Astro y TypeScript; CSS propio, Manrope variable local (SIL Open Font License), SVG para iconos y JavaScript pequeño para interacciones. Sin React, GSAP, formularios de prospectos ni servicios de datos. Imágenes WebP con tamaños adaptables generadas por Astro a partir de una fotografía original creada con IA.

```text
src/
  assets/comerciante.png   # Imagen fuente original
  components/             # Botones, tarjetas, FAQ, simulador y carrusel
  data/                   # Empresa, contacto, préstamos, condiciones, feriados, FAQ
  layouts/Layout.astro    # Metadatos, encabezado, navegación y footer
  lib/finance.ts          # Validación, dinero en céntimos y fechas UTC
  lib/links.ts            # WhatsApp y rutas
  pages/                  # Ocho páginas + robots.txt y sitemap.xml
  scripts/                # Interacción y scroll
  styles/global.css       # Sistema visual responsive
public/images/            # Logo original sin modificaciones
tests/                    # Pruebas unitarias y de navegador
docs/                     # Auditoría, recursos, pendientes, despliegue y QA
dist/                     # Resultado estático generado con build
```

## Editar contenidos

- `src/data/empresa.ts`: textos institucionales, titular y borradores.
- `src/data/prestamos.ts`: nombres, públicos, requisitos, periodicidades, máximos y proceso.
- `src/data/simulador.ts`: mínimo de capital, límite técnico, tasas, seguro, avisos y políticas pendientes.
- `src/data/contacto.ts`: número, mensajes de WhatsApp, dirección, horario y redes.
- `src/data/feriados.ts`: fechas nacionales y años revisados. Agregar cada año completo con su fuente. No agregar un año a `years` sin incorporar y revisar todos sus feriados.
- `src/data/faq.ts` y `testimonios.ts`: preguntas y ejemplos de presentación.
- `src/data/imagenes.ts`: imagen principal, logo y descripciones del recurso.
- El diseño y las decisiones de composición están en `DESIGN.md`; la estructura editorial de cada página permanece en `src/pages`.

Después de editar contenido, volver a compilar. Las páginas de producto se generan a partir de las modalidades. El simulador no realiza solicitudes de red ni usa cookies, localStorage o una base de datos. Al pulsar WhatsApp se abre un mensaje general contextual; no se incorporan importes, fechas o resultados automáticamente.

## Verificación

```powershell
npm test
npm run check
npm run lint
npm run build
npm run test:e2e
```

El navegador de pruebas usa Edge instalado. En otro equipo, instalar Edge o cambiar `channel` en `playwright.config.ts` y preparar Chromium con `npx playwright install chromium`. El informe HTML se guarda en `playwright-report/`. Las capturas están en `docs/qa/`.

Ver [resultados de verificación](docs/verificacion.md), [pendientes](docs/pendientes.md), [publicación gratuita](docs/despliegue.md), [auditoría](docs/auditoria-visual.md) y [recursos originales](docs/recursos.md).

## Estado de publicación

La indexación está desactivada por defecto. `SITE_URL` está vacío para no inventar un dominio. Al definirlo se generan canónicas y entradas del sitemap. Activar `PUBLIC_INDEXABLE=true` solo después de la revisión comercial, financiera y legal. Noindex es una instrucción para buscadores, no una restricción de acceso: no subir contenido confidencial.
