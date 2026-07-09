# 🚀 Guía de Actualización para el Frontend

Las recientes correcciones y mejoras de seguridad en el backend introducen algunos comportamientos nuevos que el equipo de **Frontend** debe tener en cuenta para asegurar la mejor experiencia de usuario. A continuación se detallan los cambios relevantes:

## 1. Manejo de Errores de Concurrencia (Pacientes) 🚨
Se ha resuelto un bug crítico en la creación y edición de pacientes (`POST /patients` y `PATCH /patients/:id`) que ocurría cuando dos usuarios intentaban registrar la misma cédula al mismo tiempo.

**¿Qué cambia para el Frontend?**
- Anteriormente el servidor explotaba con un error genérico `500 Internal Server Error`.
- Ahora, si ocurre este conflicto, el backend responderá con un código HTTP `409 Conflict` y un mensaje claro: *"Ya existe un paciente con ese documento (creado simultáneamente)"*.
- **Acción requerida:** Asegurarse de que el bloque `catch` de sus peticiones HTTP al crear pacientes capture el status `409` y le muestre una alerta amigable (por ejemplo, un Toast) al recepcionista, indicándole que recargue la página o revise la lista.

## 2. Eliminación y Restauración de Pacientes (Soft-Delete) ♻️
El backend ahora es lo suficientemente inteligente para "restaurar" un paciente que fue eliminado (soft-delete) si se vuelve a registrar un paciente con el mismo número de documento.

**¿Qué cambia para el Frontend?**
- La API responderá con un éxito (`200 OK` o `201 Created`) devolviendo los datos del paciente actualizado. 
- **Acción requerida:** Ninguna estricta. Simplemente saber que la respuesta de creación puede, en el fondo, ser una restauración. Sigan usando la data devuelta por la API para pintar la vista.

## 3. Descarga de Reportes en PDF 📄
Se crearon rutas **públicas** para los PDFs para que los pacientes puedan acceder a ellos mediante enlaces de WhatsApp. Sin embargo, **las rutas privadas para el personal interno no cambiaron**.

**¿Qué cambia para el Frontend?**
- Si un recepcionista o administrador quiere descargar un PDF desde el panel del sistema, debe seguir utilizando la ruta protegida de siempre enviando su Token JWT en los headers (`Authorization: Bearer <token>`).
  - Ruta de la orden: `GET /api/reports/order/:orderId/pdf`
  - Ruta de un resultado: `GET /api/reports/result/:resultId/pdf`
- **Acción requerida:** Ninguna. El frontend del personal administrativo no se rompe, sigue igual.

## 4. Borrado de Órdenes y Exámenes (Cascada) 🗑️
Se activó el borrado en cascada en la base de datos para corregir errores de dependencias.

**¿Qué cambia para el Frontend?**
- Antes, si intentabas eliminar una Orden que ya tenía Resultados, la base de datos bloqueaba la acción y el frontend recibía un error extraño.
- Ahora la operación tendrá éxito (eliminará la orden y sus resultados vinculados).
- **Acción requerida:** Tengan cuidado al mostrar botones de "Eliminar Orden" en el UI. Consideren añadir siempre un *Modal de Confirmación* ("¿Estás seguro? Se borrarán todos los resultados"), ya que ahora la eliminación sí se concretará con éxito.

## 5. Variables de Entorno y CORS 🌍
Se configuró correctamente el CORS para rechazar peticiones de orígenes desconocidos.

**¿Qué cambia para el Frontend?**
- **Acción requerida:** Si el equipo de Frontend levanta la app en un puerto distinto a `http://localhost:4200` durante el desarrollo local, deben pedirle al encargado del backend que agregue esa URL a la variable `FRONTEND_URL` en el archivo `.env`, de lo contrario, el navegador bloqueará las peticiones por error de CORS.
