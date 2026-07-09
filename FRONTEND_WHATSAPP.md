# Integración de WhatsApp (Frontend)

Este documento detalla el nuevo flujo de trabajo para el envío de notificaciones por WhatsApp a los pacientes. Se ha implementado una solución **100% gratuita** utilizando enlaces oficiales `wa.me` de WhatsApp (Click to Chat).

## 🚀 El Nuevo Flujo

A diferencia del envío de correos electrónicos (que ocurre en segundo plano de manera automática), el envío de WhatsApp ahora requiere una ligera interacción del usuario (la secretaria o administrador) que está operando el sistema.

1. El usuario en el frontend hace clic en el botón **"Enviar WhatsApp"**.
2. El frontend hace una petición HTTP `POST` al backend.
3. El backend **NO** envía el mensaje. En su lugar, el backend arma todo el mensaje con los resultados, genera un enlace público seguro para descargar el PDF y codifica todo en una URL de WhatsApp.
4. El backend devuelve esa `url` al frontend.
5. El frontend recibe la respuesta, toma la `url` y abre una nueva pestaña en el navegador.
6. Se abrirá **WhatsApp Web** (o la app de escritorio) con el mensaje completamente redactado y listo. El usuario del laboratorio solo debe presionar **Enter** para enviar.

---

## 🔗 Endpoints del Backend

Existen dos endpoints para esta funcionalidad (uno para resultados individuales y otro para órdenes completas). Ambos funcionan exactamente igual de cara al frontend.

### 1. Enviar Resultados de una Orden Completa
*   **Método:** `POST`
*   **Ruta:** `/api/notifications/order/:orderId/whatsapp`
*   **Body:**
    ```json
    {
      "phoneNumber": "0991234567" // Número del paciente (puede incluir el + o código de país)
    }
    ```

### 2. Enviar un Resultado Individual
*   **Método:** `POST`
*   **Ruta:** `/api/notifications/result/:resultId/whatsapp`
*   **Body:**
    ```json
    {
      "phoneNumber": "0991234567"
    }
    ```

---

## 📦 Respuesta del Backend

Si la operación es exitosa (es decir, si la orden o el resultado están validados correctamente), el backend responderá con un código `201 Created` (o `200 OK`) y el siguiente JSON:

```json
{
  "message": "Enlace de WhatsApp generado correctamente",
  "destinatario": "0991234567",
  "orden": "LAB-20260706-001", // (Solo en el endpoint de orden)
  "url": "https://wa.me/0991234567?text=%F0%9F%94%AC%20*Laboratorio%20Cl%C3%ADnico%20AG*%0A%0AEstimado%2Fa%20*Juan%20Perez*..."
}
```

> **Atención a errores:** El backend devolverá un `400 Bad Request` si se intenta generar el enlace de una orden que todavía tiene exámenes pendientes o que no han sido validados. El frontend debe mostrar este error al usuario.

---

## 💻 Ejemplo de Implementación en el Frontend

Independientemente del framework que utilicen (React, Angular, Vue), el manejo del botón "Enviar WhatsApp" debería lucir muy similar a esto (ejemplo en JavaScript puro / Axios):

```javascript
async function handleSendWhatsapp(orderId, phoneNumber) {
  try {
    // 1. Mostrar spinner/loading en el botón
    setLoading(true);

    // 2. Hacer la petición al backend
    const response = await axios.post(`/api/notifications/order/${orderId}/whatsapp`, {
      phoneNumber: phoneNumber
    });

    // 3. Extraer la URL de la respuesta
    const whatsappUrl = response.data.url;

    // 4. Abrir WhatsApp Web en una nueva pestaña
    // IMPORTANTE: Esto debe ser consecuencia de un "clic" del usuario para que 
    // el navegador no lo bloquee como una ventana emergente (pop-up blocker).
    window.open(whatsappUrl, '_blank');

    // 5. Mostrar un mensaje de éxito en la UI
    toast.success('Abriendo WhatsApp...');

  } catch (error) {
    // Manejar el caso donde la orden aún no está lista
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.message); // Ej: "No se puede generar el WhatsApp: 2 ítem(s) no tienen resultado validado."
    } else {
      toast.error('Ocurrió un error al generar el enlace.');
    }
  } finally {
    setLoading(false);
  }
}
```

## 📝 Notas Adicionales

1. **Bloqueo de Pop-ups:** Es muy importante que la acción de llamar a la API y abrir la pestaña (`window.open`) ocurra como resultado directo del clic del usuario. Algunos navegadores bloquean las nuevas pestañas si pasa mucho tiempo (por ejemplo, si la API tarda 5 segundos en responder).
2. **Descarga del PDF:** El paciente no necesitará contraseña para ver su PDF. El enlace incluido dentro del texto de WhatsApp (`/api/reports/public/order/.../pdf`) es público pero **criptográficamente seguro** (usa UUID v4), por lo que nadie más podrá adivinarlo.
