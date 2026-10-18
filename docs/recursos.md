# Recursos y procedencia

- `public/images/logo-original.jpeg`: copia byte por byte de `LOGO ORIGINAL.jpeg` entregado por el usuario (682 × 602). Se conserva completo, con proporciones originales, fondo blanco, colores y sombras. El fondo blanco exige superficies blancas; no se eliminó. El recurso horizontal adicional no sustituye al original.
- `src/assets/comerciante.png`: imagen original generada con la herramienta integrada Imagegen para este proyecto. Es una persona ficticia en una escena ilustrativa; no es una cliente real ni testimonio. Su etiqueta es visible en el hero y su naturaleza figura en los textos alternativos. No se usaron fotos de Kueski, Yape ni Caja Arequipa. Astro genera variantes WebP y `srcset`; solo la imagen principal se carga con prioridad.
- Tipografía Manrope Variable: `@fontsource-variable/manrope`, alojada localmente, licencia SIL OFL incluida en la dependencia. No se hacen peticiones a Google Fonts.
- Iconos: trazos SVG sencillos escritos para el sitio, sin emojis ni sustitución del logo.
- Ubicación: ilustración abstracta decorativa, no mapa cartográfico. El enlace abre una búsqueda de la dirección confirmada en Google Maps, sin inventar coordenadas.
- Capturas de referencias: `docs/referencias/`, únicamente evidencia de investigación, no se sirven desde `public` ni `dist`.

## Prompt final utilizado (Imagegen integrado)

Use case: photorealistic-natural. Create a premium editorial photograph for PRESTYSULL, a local microfinance website in Sullana, northern coastal Peru. A fictional Peruvian female small grocery shop owner, around 40, warm natural smile, medium brown skin, dark tied-back hair, wearing a terracotta cotton shirt and a deep navy apron. She stands behind the counter of her welcoming neighborhood fruit and grocery stall, hands resting naturally on a wooden produce crate, oranges, limes, mangoes, softly blurred everyday shop shelves behind. Contemporary real coastal Peru, warm daylight, dignified relatable entrepreneurial energy, no exoticizing, no poverty framing, no luxury bank office. Medium portrait from waist up, subject on the right-center, spacious store environment, landscape 3:2 composition suitable also for center portrait crop. Sophisticated natural documentary photography, authentic skin texture, restrained warm colors and navy details, shallow depth of field. No text, no logos, no watermarks, no signage, no money, no extra people. This is an illustrative fictional scene, not a testimonial.

## Recursos pendientes

No falta ningún recurso para ejecutar esta versión de revisión. Para una presentación documental de la empresa faltan fotografías autorizadas de la oficina, del equipo y/o de clientes; no se han sustituido por afirmaciones ficticias. Una versión de mayor resolución del logo original mejoraría la nitidez, pero no es necesaria para ejecutar el sitio.
