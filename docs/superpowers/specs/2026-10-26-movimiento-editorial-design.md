# Prestysull: movimiento editorial

## Intención

La nueva versión debe conservar la claridad y confianza de la página actual, pero hacer que el recorrido se sienta más vivo mientras la persona lee, compara modalidades y prueba el simulador. El movimiento debe reforzar el avance, la cercanía y la evaluación paso a paso; no debe sentirse como un efecto añadido sin relación con Prestysull.

## Objetivos

- Convertir la fotografía del hero en una secuencia suave de tres escenas representativas del público de Prestysull.
- Dar profundidad y respuesta a las tarjetas de préstamo semanal y catorcenal.
- Transformar el panel del proceso en una escena que evoluciona con las seis etapas.
- Dar personalidad y continuidad visual a la vista previa y al resultado del simulador.
- Mantener rendimiento, accesibilidad, navegación por teclado y buena experiencia móvil.

## Límites

- No se cambian textos comerciales, condiciones financieras, fórmulas ni reglas del simulador.
- No se añaden bibliotecas de animación ni dependencias nuevas.
- No se usan testimonios, cifras o afirmaciones no verificadas.
- Las personas de las imágenes no se presentan como clientes reales de Prestysull.
- La etiqueta Git `estable-2026-10-26` permanece como punto de retorno y el trabajo se realiza en `version/movimiento-editorial-2026-10-26`.

## Enfoques considerados

### 1. Movimiento editorial — elegido

Fundidos con recorte suave en el hero, movimiento de profundidad contenido en tarjetas y paneles que cambian de estado para explicar el proceso. Equilibra personalidad, claridad y rendimiento.

### 2. Movimiento cinematográfico

Desplazamientos amplios, parallax más visible e inclinaciones marcadas. Se descartó porque puede competir con el contenido y exigir más a teléfonos modestos.

### 3. Premium tranquilo

Fundidos y elevaciones mínimas. Se descartó porque la diferencia frente a la versión actual sería demasiado pequeña para el objetivo planteado.

## Dirección visual y movimiento

La idea central será **“cada paso impulsa el siguiente”**. Fotografías, líneas de progreso, calendarios y cifras compartirán movimientos breves en la misma dirección ascendente. Se conservarán el azul marino, el azul de acento, el plata, el blanco y el lima definidos en `DESIGN.md`.

La animación principal será el cambio de escenas del hero. El resto de los efectos responderá a la lectura, al desplazamiento o a una acción del usuario. Los bucles decorativos se detendrán cuando queden fuera de pantalla o cuando la pestaña deje de estar visible.

## Hero fotográfico

- Se utilizarán tres escenas: comercio local, emprendimiento u oficio y trabajo dependiente. La fotografía actual será una de ellas y se crearán dos recursos originales adicionales con una iluminación y tratamiento coherentes.
- Las imágenes cambiarán cada 5.5 segundos con fundido, recorte y un desplazamiento máximo de 16 px.
- La primera imagen se cargará de forma prioritaria; las siguientes se cargarán sin bloquear el primer render.
- Habrá indicadores discretos y controles accesibles con nombre visible para lectores de pantalla.
- La rotación se pausará al pasar el cursor, al enfocar los controles, cuando el hero no esté visible y cuando la pestaña esté oculta.
- Con `prefers-reduced-motion`, no habrá rotación automática; el visitante podrá cambiar de imagen manualmente.

## Tarjetas de préstamos

- Cada tarjeta conservará su contenido y jerarquía actuales.
- Al entrar en pantalla, el icono, el título, la frecuencia y las acciones aparecerán en una secuencia corta.
- En escritorio, el puntero moverá muy ligeramente una luz y una capa de profundidad dentro de la tarjeta; la tarjeta no girará más de lo necesario para conservar la legibilidad.
- Una línea de calendario propia de cada modalidad reforzará visualmente los intervalos de 7 y 14 días. Solo se moverá al interactuar o durante la entrada.
- En pantallas táctiles se usará la entrada y la respuesta al pulsar, sin perseguir el dedo ni ejecutar inclinaciones continuas.

## Panel del proceso

- El panel sticky seguirá el avance de las seis etapas y dejará de ser una tarjeta que únicamente cambia número y texto.
- Cada etapa tendrá una pequeña composición visual propia: conversación, filtro, configuración solicitada, capacidad de pago, propuesta y formalización en oficina.
- Los elementos se reemplazarán mediante fundido, escala corta y desplazamiento vertical; el progreso conservará continuidad entre estados.
- La primera etapa utilizará el icono reconocible de WhatsApp en su verde original. Las demás usarán iconos de Prestysull relacionados con su significado.
- En móvil, el panel será visible en una versión compacta antes de la lista y se actualizará con el scroll, pero no quedará fijo ocupando la pantalla.

## Simulador

### Vista previa en inicio

- La tarjeta mostrará el ejemplo como una composición de cuota y recorrido de pagos, manteniendo exactamente los valores y la advertencia actuales.
- Los renglones aparecerán en secuencia cuando la tarjeta entre en pantalla y el importe principal tendrá una transición numérica única.
- No habrá bucle permanente.

### Resultado en la página del simulador

- Al calcular o cambiar un escenario, el importe, el resumen y los marcadores de cuotas cambiarán como una sola transición de estado.
- Se añadirá una representación visual breve de la cantidad de cuotas, sin revelar fórmulas ni condiciones internas.
- El botón de WhatsApp conservará el verde oficial y permanecerá estable durante la animación.
- La lógica financiera y el cronograma no se modificarán.

## Implementación

- Astro seguirá renderizando todo el contenido visible y útil sin JavaScript.
- CSS controlará superficies, entradas, estados interactivos y alternativas de movimiento reducido.
- `IntersectionObserver`, Page Visibility API y Web Animations API coordinarán la rotación, las escenas y las transiciones dinámicas.
- Se ampliará el script existente `src/scripts/site.ts` y se mantendrá la lógica financiera en `src/scripts/simulator.ts` separada de la presentación.
- El icono oficial de WhatsApp se centralizará en un componente SVG reutilizable para evitar variantes inconsistentes.

## Verificación

- Probar navegación, controles del hero y actualización de escenas con teclado.
- Probar `prefers-reduced-motion` y pausa cuando la pestaña o la sección no están visibles.
- Verificar que las tarjetas y paneles no produzcan desbordamiento horizontal en móvil.
- Confirmar que los cálculos y cronogramas mantienen los resultados existentes.
- Ejecutar pruebas, comprobación de Astro, lint y compilación de producción.
- Revisar visualmente escritorio y móvil antes de publicar; si el navegador automatizado no está disponible, informarlo como límite.

## Criterio de aceptación

La versión estará lista cuando el hero cambie de escenas de forma suave y controlable, las tarjetas respondan con profundidad sin distraer, el panel del proceso comunique visualmente cada etapa, el simulador tenga transiciones coherentes y todo conserve la funcionalidad, accesibilidad y rendimiento de la versión estable.
