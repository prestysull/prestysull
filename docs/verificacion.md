# Verificación de la versión de revisión

Fecha: 17/10/2026 (America/Lima). Entorno: Windows, Node 24, Microsoft Edge automatizado. No se publicó externamente.

## Resultados ejecutados

| Comprobación | Resultado |
| --- | --- |
| `npm test` | 12 pruebas aprobadas: dinero, redondeo, calendario, validaciones, enlaces y carga de configuración `.env`. |
| `npm run check` | 38 archivos; 0 errores, 0 advertencias y 0 sugerencias. |
| `npm run lint` | Finalizó sin errores. |
| `npm run build` | Compilación estática correcta: 8 páginas, robots y sitemap; variantes WebP generadas. |
| `npm run test:e2e` | 12 pruebas aprobadas en 1.1 minutos; un trabajador, sin reintentos. |
| Carrusel de desarrollo | Comprobación adicional en Edge a 390px: visible como demostración, siguiente desplaza y anterior regresa al inicio. |
| Integridad del logo | SHA-256 del original y de la copia pública idénticos. |

Caso obligatorio comprobado tanto en lógica como en navegador: capital S/ 500.00, tasa 18%, seguro 1%, cuatro cuotas semanales. Interés S/ 90.00; seguro S/ 5.00; total S/ 595.00; cuota S/ 148.75.

Las pruebas cubren sumas exactas de cuotas, ajuste del residuo en la última cuota, entradas inválidas, domingos y feriados, alternativas de sábado, fechas fuera del calendario revisado e invalidación de resultados al editar los campos. La política comercial desconocida permanece visible como pendiente.

## Navegador y revisión visual

- Ocho rutas revisadas a 320, 390, 768 y 1440px: imágenes cargadas, un encabezado principal, ausencia de desbordamiento horizontal del documento y de errores JavaScript.
- Navegación interna, menú móvil mediante teclado, cierre con Escape, acordeones y enlaces contextualizados de WhatsApp comprobados. No se enviaron mensajes.
- Axe no encontró infracciones en las reglas WCAG 2 A/AA y 2.1 AA ejecutadas en las ocho rutas. Esto no equivale a una certificación de accesibilidad.
- Se verificaron movimiento reducido, avance de las etapas al desplazar, navegación sin JavaScript y formulario desactivado con aviso cuando JavaScript no está disponible.
- Una URL inexistente devuelve la página personalizada con estado 404. La ruta explícita del archivo `/404.html` puede responder 200; la prueba de error usa una URL inexistente.
- Producción excluye testimonios e historia institucional de demostración. Desarrollo permite revisarlos sin presentarlos como hechos verificados.
- Se inspeccionaron capturas de hero, modalidades, proceso, simulador móvil, pie móvil y carrusel. Evidencia en `docs/qa/`.

Durante la revisión se corrigieron el desbordamiento del pie en móvil, su jerarquía tipográfica, la lectura de `.env` y el requisito mínimo de Node. Se excluyeron los informes generados del análisis TypeScript. Una ejecución intermedia tuvo un timeout al iniciar el navegador con otras tareas concurrentes; la ejecución final completa, aislada y sin reintentos, aprobó las 12 pruebas.

## Rendimiento observado

Medición local en Edge a 1440 × 1000 durante 120 cuadros de desplazamiento:

- Recursos cargados: 239,131 bytes; JavaScript de inicio: 2,702 bytes.
- Ninguna solicitud a servicios externos durante la carga y el desplazamiento de inicio.
- Intervalo mediano entre cuadros: 16.7 ms; percentil 95: 49.8 ms.
- Se observaron dos tareas largas de 50 y 125 ms. La medición no demuestra fluidez constante a 60 FPS.

Datos reproducibles en `docs/qa/performance.json`; la prueba valida el presupuesto de JavaScript y la ausencia de solicitudes externas, no establece una garantía de FPS. Se usan imágenes adaptables, fuente local, observadores de intersección y eventos de desplazamiento pasivos.

## Límites y pendientes de verificación

No se ejecutaron Lighthouse, pruebas en teléfonos físicos, lectores de pantalla, Safari o Firefox ni una auditoría jurídica. No se verificaron entrega de mensajes en WhatsApp, disponibilidad del futuro subdominio ni comportamiento del alojamiento externo. Canónicas y sitemap con dominio real deben comprobarse al configurar y publicar.

La indexación sigue desactivada y no se inventó un dominio. Revisar `pendientes.md` antes de publicar: políticas de calendario, cuotas, seguro, transparencia financiera, identidad legal, días de atención, redes e información institucional.

Framework se consultó como solicitó el usuario, pero la cuenta no ofreció organización habilitada ni informes disponibles; no se atribuyen análisis de tráfico o conversión a ese complemento. La auditoría visual se basó en las interfaces reales y sus capturas.
