# Plan de implementación de Prestysull

**Objetivo:** sitio estático completo con consulta por WhatsApp, identidad original y simulador verificable.
**Arquitectura:** Astro genera ocho rutas; TypeScript puro para cálculo y pequeñas interacciones. Datos editables separados; CSS propio; sin runtime React ni backend.
**Especificación:** petición completa del usuario del 17/10/2026 y `DESIGN.md`.
**Ejecución:** directa y autónoma según lo pedido, con revisión final independiente.

## Alcance de archivos
- Configuración: package, Astro, TS, ESLint, Playwright, .env.example.
- Datos: empresa, contacto, préstamos, simulador, feriados, FAQ, testimonios.
- Lógica: céntimos, validación, fechas UTC, WhatsApp y URLs con base.
- Componentes: layout, iconos, enlaces, modalidades, FAQ, simulador, testimonios.
- Páginas: inicio, préstamos y dos detalles, simulador, nosotros, contacto, 404; robots/sitemap.
- Verificación: tests unitarios de dinero/calendario/enlaces y navegador responsive/accesibilidad.
- Documentación: auditoría, contenido pendiente, recursos y publicación.

## Secuencia
- [x] Escribir y ejecutar pruebas financieras antes de implementar: 500/18%/4 => 9000 interés, 500 seguro, 59500 total, 14875 por cuota; redondeo final exacto; valores inválidos; domingos/feriados; sábados pendientes; calendario no revisado; fechas sin desfase horario.
- [x] Implementar datos y lógica pura; ejecutar `npm test` hasta pasar.
- [x] Implementar sistema visual y rutas, navegación móvil, SEO y contenido centralizado.
- [x] Integrar simulador y cronograma estimado con incertidumbre visible; pruebas del caso obligatorio en navegador.
- [x] Añadir scroll, microinteracciones, foto WebP, carrusel de desarrollo y fallback sin JS.
- [x] Ejecutar `npm run check`, `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e`; inspeccionar móvil/escritorio y corregir.
- [x] Documentar despliegue gratuito recomendado en Cloudflare Pages y límites de GitHub Pages; no publicar.

## Decisiones de implementación
- Mínimo comercial de cuotas desconocido: escenarios matemáticos de 1 al máximo conocido, claramente etiquetados como no confirmados comercialmente; no se comunica un mínimo aprobado.
- Sábado pendiente: calcular alternativas hábil/no hábil, mostrando ambas si difieren.
- Periodicidad después de traslados pendiente: fechas base ancladas al desembolso para la referencia, con advertencia explícita; parametrizable y pendiente de confirmación.
- Calendario nacional revisado 2026; fuera del año revisado no certificar fechas ajustadas. Feriados locales en configuración.
- Logo original íntegro y foto original ilustrativa; historias y testimonios de demostración excluidos del build de producción.

## Riesgos a probar
Importes grandes o con más de dos decimales; fechas imposibles y cruce de año; suma exacta al dividir en tres cuotas; cambios de modalidad y errores sin resultados obsoletos; accesibilidad del menú y controles a 320px y con movimiento reducido.
