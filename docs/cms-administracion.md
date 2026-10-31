# Guía de administración de Prestysull

## Entrar

1. Abre la dirección pública del sitio y añade `/admin/` al final.
2. Inicia sesión con la única cuenta autorizada en Decap Turbo.
3. Elige una sección: Inicio, Empresa, Préstamos, Preguntas frecuentes, Contacto, Imágenes o Videos.

El acceso real estará disponible después de completar la configuración descrita en [cms-turbo-setup.md](cms-turbo-setup.md). No compartas la cuenta: el plan gratuito admite un solo asiento.

## Cambiar textos

1. Abre la sección correspondiente.
2. Cambia únicamente los campos necesarios.
3. Revisa acentos, teléfonos, enlaces y avisos antes de guardar.
4. Pulsa **Guardar**. El cambio se registra en Git y el hosting debe terminar una nueva compilación antes de verse en el sitio público.

Las fórmulas, tasas, seguro, capital mínimo, periodicidades, máximos de cuotas, feriados y advertencia financiera no aparecen en el panel. Para cambiarlos se necesita revisión técnica y comercial.

## Cambiar imágenes

1. Abre **Imágenes**.
2. Selecciona una de las tres escenas del encabezado o la imagen de Nosotros.
3. Sube un archivo WebP o JPEG de hasta 2 MB; se recomienda un máximo aproximado de 1600 px de ancho.
4. Escribe una descripción accesible clara de lo que muestra la fotografía.
5. Guarda y revisa el resultado tanto en teléfono como en computadora.

## Añadir videos

1. Abre **Videos** y añade un elemento.
2. Elige plataforma, título y pega una dirección que comience con `https://`.
3. Puedes añadir una descripción y una miniatura de hasta 2 MB.
4. Marca el elemento como visible y activa la sección general.

Los videos se abren en la plataforma externa. El sitio no incrusta reproductores. Si la sección está desactivada, vacía o todos los elementos están ocultos, no aparece ningún espacio en la página.

## Recuperar un cambio

Cada guardado queda en el historial Git del repositorio. Si algo sale mal, no sigas sobrescribiendo: anota qué cambiaste y solicita volver al commit anterior. Las versiones V5, V9, V10 y esta rama CMS se conservan por separado.
