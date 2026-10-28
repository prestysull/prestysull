# Prestysull Astro + Decap CMS — diseño

## Intención

Permitir que una persona administradora sin conocimientos técnicos edite textos, fotografías y enlaces de videos desde `/admin/`, sin abrir GitHub ni modificar código. El sitio seguirá siendo Astro estático y conservará la dirección visual de la V10.

La solución usará Decap CMS con el backend administrado `turbo-github` de Decap Turbo. Se elegirá el plan gratuito de un sitio y un asiento. Los cambios seguirán almacenándose como commits en el repositorio GitHub `prestysull/prestysull`.

## Fuentes de verdad y preservación

- Base visual y funcional: V10, commit `ebe6498`.
- Implementación aislada: rama `codex/decap-cms`.
- V5, V9, V10 y las ramas históricas existentes permanecen intactas.
- La carpeta experimental `C:\Users\LENOVO\Desktop\prestysull-wordpress` fue enviada a la Papelera a petición del usuario y no forma parte de esta solución.
- No se mezclará ni desplegará esta rama en `main` sin una aprobación posterior.

## Objetivos

1. Ofrecer una interfaz gráfica en español bajo `/admin/`.
2. Permitir cambiar textos, imágenes y enlaces de videos sin tocar código.
3. Mantener Astro, el rendimiento estático y el diseño responsive V10.
4. Mantener protegida la lógica financiera y las garantías de accesibilidad.
5. Guardar cada cambio editorial en Git para conservar historial y recuperación.
6. Mantener el costo recurrente en S/ 0 con un único administrador.
7. Ocultar por completo la sección de videos cuando no haya elementos visibles.

## No objetivos

- No convertir el sitio a WordPress.
- No crear un backend, base de datos comercial o cuentas de clientes.
- No permitir editar fórmulas, reglas de calendario o límites técnicos del simulador.
- No permitir modificar libremente componentes, CSS, navegación o código desde el CMS.
- No añadir formularios de prospectos; WhatsApp sigue siendo el único canal de captación.
- No habilitar varios administradores en la primera versión.
- No insertar reproductores de terceros, autoplay, cookies de video o rastreadores.
- No comprar ni activar planes de pago.

## Antimetas

- No exponer al administrador a YAML, JSON, GitHub o comandos.
- No permitir contenido HTML arbitrario que pueda romper el sitio o introducir scripts.
- No aceptar imágenes ilimitadas o sin instrucciones de tamaño.
- No publicar afirmaciones financieras, regulatorias o institucionales no verificadas.
- No hacer que un error editorial llegue silenciosamente a producción: una configuración inválida debe detener la compilación.

## Enfoques considerados

### 1. Decap Turbo Free con `turbo-github` — elegido

Ofrece autenticación administrada, un sitio y un asiento sin costo. La persona administradora entra por `/admin/`, sin cuenta GitHub ni acceso al repositorio. El contenido permanece en Git y puede migrarse a otro backend más adelante.

Es la opción elegida porque cumple el objetivo principal con la menor carga técnica. Su límite aceptado es un único administrador.

### 2. Decap CMS con backend GitHub y proxy OAuth propio — descartado

Permitiría varios administradores sin pagar, pero cada persona necesitaría una cuenta GitHub con acceso al repositorio y habría que operar un proxy OAuth. Contradice la experiencia sencilla solicitada y añade mantenimiento y riesgo de credenciales.

### 3. Netlify Identity + Git Gateway — descartado

Podría ofrecer usuarios sin GitHub, pero Git Gateway está deprecado para configuraciones nuevas. No se adoptará una dependencia cuya propia documentación ya no recomienda para nuevos proyectos.

## Restricción externa pendiente

Decap Turbo requiere crear gratuitamente una organización, conectar la aplicación GitHub de Turbo, registrar el repositorio y crear un sitio. Esa operación genera un UUID público `turbo_site_id`.

El usuario todavía no dispone de ese UUID. La implementación incluirá un marcador explícito y documentación paso a paso. La compilación local y la interfaz se podrán probar, pero el inicio de sesión real no se considerará verificado hasta completar esta configuración externa.

Antes de publicar `/admin/` como operativo se debe:

1. Crear la cuenta gratuita de Decap Turbo.
2. Conectar únicamente `prestysull/prestysull` mediante la aplicación GitHub.
3. Crear un sitio Turbo y registrar la URL pública exacta terminada en `/admin/`.
4. Sustituir el marcador por el `turbo_site_id` real.
5. Invitar o conservar solo a la persona administradora aprobada.

El `turbo_site_id` no es un secreto, pero debe corresponder exactamente al sitio registrado.

## Arquitectura de contenido

El contenido editable se moverá de módulos TypeScript dispersos a archivos JSON legibles por Astro y Decap:

- `src/content/cms/home.json`: hero, introducciones, llamadas a la acción y textos de secciones del inicio.
- `src/content/cms/company.json`: nombre, lema, presentación y textos institucionales confirmados.
- `src/content/cms/contact.json`: teléfono, WhatsApp, dirección, horario, cobertura, redes, mapa y mensajes predeterminados.
- `src/content/cms/loans.json`: nombres, públicos, titulares, descripciones, requisitos y textos de los seis pasos.
- `src/content/cms/faq.json`: preguntas visibles y ordenables.
- `src/content/cms/media.json`: tres escenas del hero, imagen de Nosotros, textos alternativos y etiquetas.
- `src/content/cms/videos.json`: activación, título, introducción y lista ordenable de enlaces.

Los archivos existirán desde el primer commit porque las colecciones de archivos de Decap requieren archivos válidos ya presentes en el repositorio.

`src/lib/content.ts` será la única puerta de entrada para componentes y páginas. Importará y validará los JSON con esquemas estrictos antes de exponer datos tipados. Los componentes no leerán JSON directamente.

## Límites entre contenido y lógica protegida

### Editables

- Titulares, párrafos, etiquetas, botones y llamadas a la acción.
- Textos alternativos de imágenes.
- Fotografías del hero y de las secciones editoriales.
- Requisitos y descripciones públicas de préstamos.
- Preguntas frecuentes, con alta, baja y reordenamiento.
- Datos de contacto, redes sociales y mensajes de WhatsApp.
- Títulos, descripciones, miniaturas, plataformas, URLs y visibilidad de videos.
- Activación general de la sección de videos.

### Protegidos en código

- Fórmula y precisión monetaria del simulador.
- Capital mínimo y límite técnico.
- Tasas permitidas, seguro y valores predeterminados.
- Periodicidades de 7 y 14 días y máximos de 8/4 cuotas.
- Política de calendario y feriados.
- Iconos técnicos y correspondencia entre modalidad y comportamiento.
- Estructura de navegación, HTML semántico, foco, accesibilidad y CSS.
- Advertencia financiera obligatoria.

`src/data/prestamos.ts` combinará los textos validados del CMS con las reglas numéricas protegidas. `src/data/simulador.ts`, `src/lib/finance.ts` y sus pruebas conservarán la autoridad sobre los cálculos.

Los seis pasos del proceso serán editables en texto, pero no se podrán agregar, eliminar ni reordenar desde Decap para no romper el scrollytelling.

## Interfaz administrativa

Se añadirán:

- `public/admin/index.html`, con Decap CMS 3.17.3 fijado desde jsDelivr.
- `public/admin/config.yml`, con interfaz en español, backend `turbo-github`, rama `main`, `local_backend: true`, carga de medios y colecciones de archivos.
- `public/uploads/`, con recursos iniciales optimizados y las futuras cargas del CMS.

La navegación del editor se organizará con nombres humanos:

1. Página de inicio.
2. Empresa.
3. Préstamos y proceso.
4. Preguntas frecuentes.
5. Contacto y redes.
6. Imágenes.
7. Videos.

Los campos tendrán ayudas cortas, límites y ejemplos en español. No se mostrará ninguna fórmula financiera ni vocabulario técnico del repositorio.

## Imágenes

Decap guardará los archivos en `public/uploads/` y los valores públicos comenzarán con `/uploads/`. Astro servirá esas imágenes sin procesamiento adicional, por lo que:

- El CMS limitará cada archivo a 2 MB.
- La ayuda recomendará WebP o JPEG, máximo aproximado de 1600 px de ancho.
- Las imágenes iniciales grandes se convertirán una sola vez a WebP.
- Cada imagen publicada exigirá texto alternativo.
- Los contenedores mantendrán proporciones CSS para reducir cambios de diseño.
- Los componentes usarán `loading="lazy"` fuera del primer viewport y `decoding="async"`.
- La primera imagen del hero será prioritaria; las restantes se cargarán de forma diferida.

La pérdida de optimización automática para imágenes futuras se acepta para mantener una biblioteca gráfica simple. Si el volumen crece, se evaluará posteriormente un flujo de transformación en compilación.

## Videos

La nueva sección será una colección de tarjetas con:

- Visible: sí/no.
- Plataforma: YouTube, TikTok, Facebook u otra.
- Título.
- Descripción opcional.
- URL HTTPS.
- Miniatura opcional cargada al repositorio.

La página no incrustará reproductores. Cada tarjeta abrirá el video externo en una pestaña nueva con `noopener noreferrer`. Esto evita cookies, scripts pesados y problemas de consentimiento.

La sección se renderizará únicamente cuando `enabled` sea verdadero y exista al menos un elemento visible con URL HTTPS válida. En cualquier otro caso no dejará título, espacio vacío ni navegación huérfana.

## Autenticación y publicación

El flujo final será:

1. La administradora visita `https://sitio/admin/`.
2. Decap abre el inicio de sesión hospedado por Turbo.
3. Turbo valida su único asiento y el acceso al sitio.
4. Decap lee los archivos JSON y medios del repositorio.
5. Guardar crea un commit real en la rama `main`.
6. El proveedor de hosting detecta el commit, ejecuta `npm ci && npm run build` y publica `dist/`.

La interfaz `/admin/` no implica que una edición esté publicada hasta que el hosting termine la compilación. La conexión automática del hosting a GitHub y la fusión de V10/CMS en `main` son trabajos externos posteriores y requieren autorización independiente.

## Seguridad

- `/admin/` será una ruta pública, pero leer o escribir contenido exigirá sesión Turbo válida.
- El repositorio se limitará en la aplicación GitHub de Turbo; no se concederá acceso a otros repositorios.
- No se almacenarán secretos en `config.yml`, JSON o variables públicas.
- Los campos URL exigirán HTTPS; teléfono, WhatsApp y fechas usarán patrones de validación.
- Los campos de texto serán simples o multilínea, sin HTML arbitrario.
- Astro escapará el contenido al renderizarlo.
- Los archivos JSON se validarán durante `astro check`, pruebas y compilación.
- Un dato inválido detendrá el despliegue y conservará la última versión pública correcta.
- La interfaz no permitirá editar lógica financiera.

## Compatibilidad con rutas base

El proyecto admite `BASE_PATH`. Las rutas de medios guardadas como `/uploads/...` pasarán por un helper `cmsAssetUrl()` que normaliza la ruta mediante la utilidad existente `pathUrl()`. Esto evita romper imágenes si el sitio se publica en un subdirectorio.

Las URLs externas no pasarán por ese helper y se validarán por separado.

## SEO, accesibilidad y rendimiento

- Las páginas conservarán un solo H1 y la jerarquía actual.
- Los textos alternativos serán obligatorios en el CMS y en los esquemas.
- La sección de videos usará enlaces nombrados, no iframes.
- El hero conservará teclado, gesto táctil, pausa y movimiento reducido.
- No se añadirá JavaScript de Decap a las páginas públicas; solo se cargará dentro de `/admin/`.
- Los metadatos y datos estructurados usarán únicamente contenido verificado.
- El CMS no podrá insertar scripts, HTML o CSS.

## Desarrollo local

`local_backend: true` permitirá usar Decap Proxy en desarrollo. Se documentarán dos procesos:

1. `npm run dev` para Astro.
2. `npm run cms` para el proxy local de Decap.

La edición local escribe en el checkout local; no prueba Turbo. El backend real solo se probará después de registrar el sitio y reemplazar el UUID.

## Migración

1. Crear los JSON con el contenido exacto actualmente publicado en V10.
2. Añadir esquemas y helpers, manteniendo las exportaciones públicas usadas por componentes.
3. Cambiar consumidores gradualmente y ejecutar pruebas después de cada archivo.
4. Copiar/optimizar recursos iniciales en `public/uploads/`.
5. Añadir `/admin/` y `config.yml`.
6. Añadir la sección opcional de videos, inicialmente desactivada y vacía.
7. Ejecutar build, TypeScript, lint, unidad, enlaces y navegador.

No se borrarán los módulos originales hasta que todos los consumidores usen el contenido validado y las pruebas pasen. Los cambios se mantendrán en commits recuperables.

## Verificación

- Validación de `config.yml` y correspondencia exacta entre campos Decap y JSON.
- Pruebas de esquemas para contenido válido e inválido.
- Pruebas de que reglas financieras no aparecen en campos CMS.
- Caso financiero obligatorio sin cambios.
- Construcción Astro completa.
- Navegación y WhatsApp sin regresiones.
- Hero e imágenes en 320, 390, 768 y 1440 px.
- Videos ocultos cuando están desactivados/vacíos y visibles con enlaces válidos.
- `/admin/` carga Decap 3.17.3 y solicita `config.yml`.
- Revisión de que el marcador `turbo_site_id` impide afirmar autenticación real.
- Prueba local de edición mediante Decap Proxy.

## Entregables

- Implementación en la rama `codex/decap-cms`.
- Ruta `/admin/` funcional en local.
- Archivos de contenido y medios iniciales migrados.
- Sección opcional de videos.
- Guía para la administradora.
- Guía ilustrada para crear la cuenta gratuita y obtener `turbo_site_id`.
- Resultados de pruebas y lista separada de pendientes externos.

## Decisiones del usuario

- Conservar Astro; no WordPress.
- Usar Decap CMS con Decap Turbo `turbo-github`.
- Mantener costo recurrente en S/ 0.
- Utilizar un único administrador.
- Permitir edición gráfica de textos, imágenes y enlaces de videos.
- Mostrar videos en una sección opcional del inicio, oculta cuando no haya contenido.

## Decisiones técnicas del constructor

- Usar archivos JSON y colecciones de archivos de Decap para reducir ambigüedad y facilitar validación.
- Mantener las imágenes en `public/uploads/` con límite de 2 MB, aceptando que Astro no las optimizará automáticamente.
- Mostrar videos como enlaces externos con miniatura, no como embeds.
- Fijar Decap CMS 3.17.3 para evitar cambios inesperados del CDN.
- Configurar el backend editorial para `main`, pero no fusionar ni desplegar sin aprobación posterior.
- Fallar la compilación ante contenido inválido para proteger la versión pública.

