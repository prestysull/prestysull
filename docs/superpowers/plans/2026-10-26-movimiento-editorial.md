# Prestysull Editorial Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir el lenguaje de movimiento editorial aprobado al hero, las tarjetas de préstamos, el proceso y el simulador sin cambiar reglas ni contenido financiero.

**Architecture:** Astro conserva el contenido y el primer estado renderizados en HTML. CSS define las superficies y alternativas de movimiento reducido; `IntersectionObserver`, Page Visibility API y Web Animations API coordinan únicamente los estados dinámicos, sin dependencias nuevas.

**Tech Stack:** Astro 7, TypeScript, CSS, JavaScript del navegador, Playwright existente.

**Spec:** `docs/superpowers/specs/2026-10-26-movimiento-editorial-design.md`

## Global Constraints

- No cambiar textos comerciales, condiciones financieras, fórmulas ni reglas del simulador.
- No añadir bibliotecas de animación ni dependencias nuevas.
- No presentar a las personas de las imágenes como clientes reales de Prestysull.
- Conservar el contenido visible y útil sin JavaScript.
- Detener animaciones no esenciales fuera de pantalla o con la pestaña oculta.
- Con `prefers-reduced-motion`, eliminar la rotación automática y conservar controles y cambios de estado legibles.
- Mantener `estable-2026-10-26` sin cambios; trabajar en `version/movimiento-editorial-2026-10-26`.

## Review Focus

- JavaScript desactivado: la primera fotografía, las tarjetas, el proceso y el simulador siguen mostrando contenido útil; se verifica en Task 2 y Task 4.
- Movimiento reducido: el hero no avanza solo y sus controles manuales funcionan; se verifica en Task 2.
- Pestaña oculta o hero fuera de pantalla: el temporizador se detiene y retoma sin saltos rápidos; se verifica en Task 2.
- Móvil de 320 px: el panel compacto permanece visible y ninguna superficie desborda horizontalmente; se verifica en Task 3 y Task 5.
- Recalcular o invalidar el simulador: los marcadores reflejan la cantidad de cuotas y desaparecen con el resultado sin alterar importes; se verifica en Task 4.

---

### Task 1: Recursos editoriales e icono oficial de WhatsApp

**Files:**
- Create: `src/assets/emprendedora-peruana.png`
- Create: `src/assets/trabajador-peruano.png`
- Create: `src/components/WhatsAppMark.astro`
- Create: `tests/images.test.ts`
- Modify: `src/data/imagenes.ts`
- Modify: `src/components/WhatsApp.astro`
- Test: `tests/browser/site.spec.ts`

**Interfaces:**
- Produces: `images.hero`, una lista ordenada de `{src, alt, label}`; `WhatsAppMark.astro` con prop opcional `size: number`.

- [ ] **Step 1: Crear dos fotografías editoriales originales**

Generar una escena de emprendimiento u oficio y otra de trabajo dependiente, ambas naturales, peruanas, sin logotipos, textos ni apariencia de cliente identificado. Guardarlas en los nombres indicados.

- [ ] **Step 2: Escribir las pruebas de recursos y marca**

En `images.test.ts`, comprobar que `images.hero` contiene tres recursos con `alt` y `label` no vacíos. En `site.spec.ts`, comprobar que los enlaces de WhatsApp contienen un SVG con clase `.whatsapp-mark`.

- [ ] **Step 3: Ejecutar la prueba y verificar que falla**

Run: `npm test && npx playwright test tests/browser/site.spec.ts -g "icono oficial de WhatsApp"`
Expected: FAIL porque `images.hero` y `.whatsapp-mark` todavía no existen.

- [ ] **Step 4: Implementar recursos y marca reutilizable**

Exportar `images.hero` desde `imagenes.ts`; crear el SVG accesible decorativo en `WhatsAppMark.astro`; sustituir el icono genérico de `WhatsApp.astro` sin cambiar enlaces ni mensajes.

- [ ] **Step 5: Ejecutar la prueba y confirmar que pasa**

Run: `npm test && npx playwright test tests/browser/site.spec.ts -g "icono oficial de WhatsApp"`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/assets src/data/imagenes.ts src/components/WhatsAppMark.astro src/components/WhatsApp.astro tests/images.test.ts tests/browser/site.spec.ts
git commit -m "feat: add editorial hero assets and WhatsApp mark"
```

### Task 2: Hero fotográfico controlable

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/scripts/site.ts`
- Modify: `src/styles/global.css`
- Test: `tests/browser/site.spec.ts`

**Interfaces:**
- Consumes: `images.hero` y `WhatsAppMark.astro` de Task 1.
- Produces: atributos `[data-hero-gallery]`, `[data-hero-slide]`, `[data-hero-dot]` y estado `data-active-slide`.

- [ ] **Step 1: Escribir pruebas del carrusel y sus pausas**

Añadir casos que validen tres diapositivas con imágenes y textos alternativos, selección manual, nombres accesibles, ausencia de avance automático con movimiento reducido, primer estado útil sin JavaScript y pausa/reanudación al emitir `visibilitychange` con `document.visibilityState` controlado dentro de la prueba.

- [ ] **Step 2: Ejecutar las pruebas y verificar que fallan**

Run: `npx playwright test tests/browser/site.spec.ts -g "hero"`
Expected: FAIL por faltar controles y comportamiento.

- [ ] **Step 3: Renderizar la galería en Astro**

Reemplazar la figura única por tres diapositivas superpuestas, cargar la primera con prioridad y las demás de forma diferida, y añadir botones indicadores con nombres accesibles.

- [ ] **Step 4: Implementar el controlador del hero**

En `site.ts`, cambiar cada 5.5 segundos; pausar por hover, foco, sección fuera de pantalla, pestaña oculta y movimiento reducido; permitir selección manual sin ocultar contenido cuando falle JavaScript.

- [ ] **Step 5: Implementar la transición editorial**

En `global.css`, usar opacidad, clip y desplazamiento máximo de 16 px; definir estados activos, foco y alternativa sin movimiento.

- [ ] **Step 6: Ejecutar pruebas del hero**

Run: `npx playwright test tests/browser/site.spec.ts -g "hero"`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro src/scripts/site.ts src/styles/global.css tests/browser/site.spec.ts
git commit -m "feat: add accessible editorial hero rotation"
```

### Task 3: Tarjetas de préstamos y panel vivo del proceso

**Files:**
- Modify: `src/components/LoanCards.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/Icon.astro`
- Modify: `src/scripts/site.ts`
- Modify: `src/styles/global.css`
- Test: `tests/browser/site.spec.ts`

**Interfaces:**
- Consumes: `WhatsAppMark.astro` de Task 1 y `processSteps` existente.
- Produces: `[data-loan-card]`, `[data-card-light]`, `[data-process-scene]` y `data-scene` con valores `0` a `5`.

- [ ] **Step 1: Escribir pruebas de tarjetas y proceso**

Comprobar que ambas tarjetas tienen su línea de 7/14 días, que el proceso muestra seis escenas, que el primer estado contiene `.whatsapp-mark`, que el scroll actualiza `data-scene` y que el panel compacto está visible a 320 px.

- [ ] **Step 2: Ejecutar las pruebas y verificar que fallan**

Run: `npx playwright test tests/browser/site.spec.ts -g "tarjetas y proceso editorial"`
Expected: FAIL por faltar la nueva estructura.

- [ ] **Step 3: Ampliar el marcado de las tarjetas**

Añadir capas decorativas, una línea de frecuencia y atributos de interacción sin modificar títulos, límites, enlaces ni CTA.

- [ ] **Step 4: Construir las seis escenas del panel**

Renderizar conversación, filtro, parámetros solicitados, capacidad, propuesta y oficina; usar la marca de WhatsApp solo en la primera y los iconos existentes o añadidos para las demás.

- [ ] **Step 5: Coordinar estados e interacción**

Reutilizar el observador del proceso para actualizar escena, título, número y progreso; aplicar luz de puntero únicamente en dispositivos con hover y detenerla al salir.

- [ ] **Step 6: Estilizar profundidad y versión móvil**

Aplicar luz, sombra y desplazamientos contenidos; mostrar el panel compacto en móvil sin sticky ni inclinación continua; incluir reduced-motion.

- [ ] **Step 7: Ejecutar las pruebas de tarjetas y proceso**

Run: `npx playwright test tests/browser/site.spec.ts -g "tarjetas y proceso editorial"`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/components/LoanCards.astro src/components/Icon.astro src/pages/index.astro src/scripts/site.ts src/styles/global.css tests/browser/site.spec.ts
git commit -m "feat: animate loan cards and evaluation process"
```

### Task 4: Movimiento coherente del simulador

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/Simulator.astro`
- Modify: `src/scripts/site.ts`
- Modify: `src/scripts/simulator.ts`
- Modify: `src/styles/global.css`
- Test: `tests/browser/site.spec.ts`

**Interfaces:**
- Produces: `[data-preview-payment]`, `[data-installment-track]` y marcadores `[data-installment-marker]` sincronizados con el número de cuotas.

- [ ] **Step 1: Escribir pruebas del estado visual del simulador**

Validar cuatro marcadores iniciales, tres después de recalcular a tres cuotas, ocultación tras editar un campo, conservación de S/ 148.75 y contenido útil sin JavaScript.

- [ ] **Step 2: Ejecutar las pruebas y verificar que fallan**

Run: `npx playwright test tests/browser/site.spec.ts -g "movimiento del simulador"`
Expected: FAIL porque los marcadores no existen.

- [ ] **Step 3: Mejorar la vista previa del inicio**

Añadir recorrido de pagos y renglones escalonados al ejemplo actual sin cambiar importes ni advertencias.

- [ ] **Step 4: Añadir la pista de cuotas al resultado**

Renderizar un contenedor vacío útil como decoración y hacer que `simulator.ts` cree un marcador por cuota después de cada cálculo válido y lo vacíe al invalidar el resultado.

- [ ] **Step 5: Animar cambios de resultado**

Usar Web Animations API para una transición breve de importe, resumen y marcadores; omitir desplazamiento con reduced-motion y mantener el CTA estable.

- [ ] **Step 6: Ejecutar pruebas del simulador y finanzas**

Run: `npx playwright test tests/browser/site.spec.ts -g "movimiento del simulador|caso obligatorio" && npm test`
Expected: PASS; 12 pruebas unitarias pasan y el caso obligatorio conserva S/ 148.75.

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro src/components/Simulator.astro src/scripts/site.ts src/scripts/simulator.ts src/styles/global.css tests/browser/site.spec.ts
git commit -m "feat: animate simulator preview and results"
```

### Task 5: Adaptación, rendimiento y validación final

**Files:**
- Modify: `src/styles/global.css`
- Modify: `tests/browser/performance.spec.ts`
- Generated QA: `docs/qa/*`

**Interfaces:**
- Consumes: todos los selectores y estados de Tasks 1–4.

- [ ] **Step 1: Completar casos responsive y de rendimiento**

Añadir aserciones para 320, 390, 768 y 1440 px, recursos internos únicamente, cero errores de página y presupuesto de JavaScript menor de 30 KB.

- [ ] **Step 2: Ejecutar detector de diseño una vez**

Run: `C:\Users\LENOVO\.codex\skills\impeccable\scripts\impeccable.cmd detect --json src/pages/index.astro src/components/LoanCards.astro src/components/Simulator.astro src/styles/global.css`
Expected: revisar y corregir hallazgos aplicables sin cambiar la dirección aprobada.

- [ ] **Step 3: Ejecutar validación completa**

Run: `npm test && npm run check && npx eslint src astro.config.mjs tests && npm run build && npm run test:e2e`
Expected: todas las pruebas pasan, Astro informa 0 errores y la compilación genera las páginas estáticas.

- [ ] **Step 4: Revisar capturas de escritorio y móvil**

Comparar inicio y simulador en 320, 390, 768 y 1440 px; corregir recortes, legibilidad, foco, contraste y desbordamiento antes de continuar.

- [ ] **Step 5: Verificar el diff y commit final**

Run: `git diff --check && git status --short`
Expected: sin errores de espacios; solo archivos previstos o artefactos QA deliberados.

```bash
git add src/styles/global.css tests/browser/performance.spec.ts docs/qa
git commit -m "test: verify editorial motion experience"
```

- [ ] **Step 6: Publicar únicamente después de validación**

Guardar y desplegar la nueva versión en el proyecto Sites existente; verificar el estado terminal y conservar la URL pública actual. La etiqueta `estable-2026-10-26` sigue siendo el punto de reversión.
