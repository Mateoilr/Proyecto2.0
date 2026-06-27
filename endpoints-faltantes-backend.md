# Endpoints y Funcionalidades Pendientes en el Backend

Tras una auditoría completa del backend (`c:\Tesis\backendlaboratorioag`) comparándolo con la documentación de `Roles y funcionalidades.md` y las necesidades del Frontend, se han detectado las siguientes discrepancias, endpoints faltantes o refactorizaciones pendientes.

**Nota:** Muchos de los módulos que antes se consideraban ausentes (como *Reports*, *Notifications*, *Chatbot* y *Audit*) **sí están implementados**. Esta lista contiene los hallazgos actualizados reales.

## 1. Módulo Results (Resultados)
El ciclo de vida de los resultados incluye validación, rechazo y entrega, lo cual está correctamente implementado. Sin embargo, no existe una forma de corregir un resultado (como un error de tipeo) sin que el Validador lo rechace primero. Además, si es rechazado, el frontend intenta editarlo y falla.
- **Falta**: `PATCH /api/results/:id` (Edición general)
- **Falta**: Endpoint o lógica para permitir sobrescribir o registrar nuevamente un resultado que ha sido `RECHAZADO` (actualmente `POST /api/results` genera `ConflictException` si el ítem ya tiene resultado).

## 2. Módulo Notifications (Notificaciones)
La gran mayoría de notificaciones vía Brevo (Email y WhatsApp) están presentes, salvo una que se detalla en el documento de requerimientos.
- **Falta**: `POST /api/notifications/order/:orderId/whatsapp` - Enviar resumen de orden completa por WhatsApp.

## 3. Módulo Patients (Pacientes) - Campos Faltantes
El frontend y el módulo de Notificaciones requieren imperativamente enviar reportes PDF al paciente vía correo electrónico.
- **Falta**: El modelo `Patient` en la base de datos (Prisma) no contempla la columna `email`.
- **Refactorización**: Se debe añadir `email?: string;` a `CreatePatientDto` y `UpdatePatientDto`. Actualmente, enviar este campo produce un error HTTP 400 debido al `ValidationPipe` estricto (`forbidNonWhitelisted: true`).

## 4. Módulo de Usuarios / Autenticación (`users` / `auth`)
El CRUD de usuarios está alineado, pero carece de un mecanismo para que un administrador cambie o restablezca contraseñas por olvido.
- **Falta**: `PATCH /api/users/:id/password` - Endpoint dedicado a la actualización de contraseñas de cuentas existentes (ya que `UpdateUserDto` no admite el campo `password`).

## 5. Módulo de Auditoría (`audit`) - Limitaciones de Búsqueda
Actualmente el controlador `/api/audit` posee limitaciones que restringen las funcionalidades requeridas por el frontend:
- **Búsqueda General**: El endpoint solo admite filtrar por `entidad` exacta o `userId` (UUID). No soporta una búsqueda genérica (ej. `?search=Carlos`) ni de texto libre para buscar en las propiedades de la entidad o nombre de usuario. Esto obliga al frontend a reducir la capacidad del buscador de texto a buscar únicamente por el nombre exacto de la entidad (ej. `LabOrder`).
- **Acciones Incompletas**: El Enum `AuditAction` de Prisma solo contempla `CREATE`, `UPDATE`, `DELETE`. Faltan acciones importantes requeridas para una auditoría de seguridad como `LOGIN` y `LOGOUT`.

## 6. M�adulo Dashboard (dashboard o stats)
Actualmente el backend no provee un endpoint de estad�sticas globales o panel de control. Esto obliga al frontend a realizar peticiones completas a las tablas (GET /orders, GET /patients, etc.) para contar los registros y simular el Dashboard de cada rol, lo cual es muy ineficiente a nivel de red y base de datos en entornos de producci�n.
- **Falta**: GET /api/dashboard/stats - Endpoint que retorne m�tricas sumarizadas dependiendo del rol del usuario (ej. �rdenes de hoy, resultados pendientes, ex�menes activos, pacientes registrados).




## ✅ Resoluciones de Endpoints y Funcionalidades

**1. Módulo Results:** Se implementó `PATCH /api/results/:id` en `ResultsController` y la lógica en `ResultsService.update()` que permite modificar resultados en estado `REGISTRADO` o `RECHAZADO`, reevaluando rangos automáticamente y reasignando el ítem a `EN_ANALISIS` en caso de provenir de un rechazo.

**2. Módulo Notifications:** Se añadió el endpoint `POST /api/notifications/order/:orderId/whatsapp` en el controlador y el método `sendOrderWhatsapp()` en el servicio de notificaciones, enviando un listado completo de los resultados validados de la orden vía Brevo.

**3. Módulo Patients:** Se ejecutó una migración de Prisma (`add_email_to_patient`) agregando el campo opcional `email String?` al esquema. Además, se actualizó `CreatePatientDto` y `UpdatePatientDto` con `@IsEmail()` e `@IsOptional()`.

**4. Módulo de Usuarios:** Se creó `PATCH /api/users/:id/password` utilizando bcrypt para verificar y cifrar la nueva contraseña. Solo accesible por el ADMINISTRADOR o validando `currentPassword`.

**5. Módulo de Auditoría:** Se añadió `LOGIN` y `LOGOUT` al `AuditAction` en Prisma. El `AuthService` ahora registra el login en `AuditLog`. Se agregó el endpoint `POST /api/auth/logout`. Se actualizó la búsqueda general en `AuditService.findAll()` permitiendo filtrar texto libre mediante `OR` en entidad y nombres de usuario.

**6. Módulo Dashboard:** Se creó íntegramente el módulo `dashboard` con el endpoint `GET /api/dashboard/stats`, proveyendo las métricas globales desde la base de datos de manera eficiente.

**7. Módulo Results (Rangos de Referencia):**
El endpoint que trae los resultados (`GET /results` o `GET /results/pending-validation`) debe incluir los `Rangos de Referencia` (valorMin, valorMax, textoReferencia) asociados al examen para que el frontend pueda pintar de colores (rojo, azul, verde) si un valor es mayor, menor o normal durante la validación visual.