# 🏥 LaboratorioAG — Roles y Funcionalidades del Sistema

> **Sistema de Gestión de Laboratorio Clínico**
> Stack: NestJS · PostgreSQL · Prisma ORM · Angular · JWT

---

## 👥 Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| 🟢 **SECRETARIO** (Recepción) | Gestiona la atención al paciente, crea órdenes, entrega resultados y se comunica con los pacientes. |
| 🔵 **LABORATORISTA** | Toma de muestras, registra resultados y da seguimiento al estado de análisis. |
| 🟣 **VALIDADOR** | Revisa, valida o rechaza los resultados garantizando la calidad antes de la entrega. |
| 🟠 **ADMINISTRADOR** | Administra el sistema, usuarios, roles, auditoría y configuración general. |

---

## 🔐 Matriz de Acciones por Rol

| Acción del Sistema | SECRETARIO | LABORATORISTA | VALIDADOR | ADMINISTRADOR |
|--------------------|:----------:|:-------------:|:---------:|:-------------:|
| Registrar pacientes | ✅ | — | — | ✅ |
| Crear órdenes | ✅ | — | — | ✅ |
| Consultar órdenes | ✅ | ✅ | ✅ | ✅ |
| Registrar muestras (toma de muestra) | — | ✅ | — | ✅ |
| Registrar resultados | — | ✅ | — | ✅ |
| Consultar resultados | — | ✅ | ✅ | ✅ |
| Validar resultados | — | — | ✅ | ✅ |
| Entregar resultados | ✅ | — | — | ✅ |
| Enviar resultados (PDF, Email, WhatsApp) | ✅ | — | — | ✅ |
| Gestionar usuarios | — | — | — | ✅ |
| Gestionar roles | — | — | — | ✅ |
| Ver auditoría | — | — | — | ✅ |
| Configurar sistema | — | — | — | ✅ |

> **Leyenda:** ✅ Puede realizar la acción · — No tiene permiso · Acción compartida entre roles indicada con ✅ en ambas columnas.

---

## 📋 Funcionalidades Detalladas por Módulo

### 1. 👤 Gestión de Pacientes
**Roles permitidos:** SECRETARIO, ADMINISTRADOR (crear/editar) · LABORATORISTA, VALIDADOR, MÉDICO (consultar)

| Funcionalidad | Endpoint | Descripción |
|---------------|----------|-------------|
| Crear paciente | `POST /api/patients` | Registra nuevo paciente con datos demográficos |
| Listar pacientes | `GET /api/patients` | Lista todos los pacientes activos (no eliminados) |
| Ver paciente | `GET /api/patients/:id` | Obtiene datos del paciente + sus órdenes asociadas |
| Actualizar paciente | `PATCH /api/patients/:id` | Modifica datos del paciente |
| Eliminar paciente | `DELETE /api/patients/:id` | Soft delete (no se elimina físicamente de la BD) |

**Validaciones:**
- Documento de identidad único y obligatorio
- No se permiten duplicados
- Soft delete: el historial se preserva

---

### 2. 🧪 Catálogo de Exámenes
**Roles permitidos:** ADMINISTRADOR (gestión completa)

| Funcionalidad | Endpoint | Descripción |
|---------------|----------|-------------|
| Crear examen | `POST /api/exams` | Crea examen con rangos de referencia |
| Listar exámenes | `GET /api/exams` | Lista exámenes activos |
| Ver examen | `GET /api/exams/:id` | Obtiene examen con sus rangos de referencia |
| Actualizar examen | `PATCH /api/exams/:id` | Modifica datos del examen |
| Cambiar estado | `DELETE /api/exams/:id` | Activa o desactiva el examen |

**Atributos del Examen:**
- Nombre, código único, descripción, precio
- Tipo de muestra (Sangre, Orina, Heces, etc.)
- Categoría (Hematología, Bioquímica, etc.)
- Rangos de referencia por sexo y edad (valorMin, valorMax)

---

### 3. 📄 Órdenes de Laboratorio
**Roles permitidos:** SECRETARIO, ADMINISTRADOR (crear) · LABORATORISTA, VALIDADOR, MÉDICO (consultar)

| Funcionalidad | Endpoint | Descripción |
|---------------|----------|-------------|
| Crear orden | `POST /api/orders` | Crea orden con uno o más exámenes para un paciente |
| Listar órdenes | `GET /api/orders` | Lista órdenes con paciente e ítems asociados |
| Ver orden | `GET /api/orders/:id` | Obtiene orden completa con detalles de ítems y resultados |
| Actualizar orden | `PATCH /api/orders/:id` | Cambia estado y/o prioridad |
| Eliminar orden | `DELETE /api/orders/:id` | Elimina la orden |

**Estados de la Orden:**
```
CREADA → EN_PROCESO → CERRADA
```

**Prioridad:** NORMAL · URGENTE

**Al crear una orden se genera automáticamente:**
- Código único formato `ORD-2026-0001`
- Un `OrderItem` por cada examen seleccionado en estado `PENDIENTE`

---

### 4. 🧬 Ítems de Orden (Toma de Muestras)
**Roles permitidos:** LABORATORISTA, SECRETARIO, ADMINISTRADOR

| Funcionalidad | Endpoint | Descripción |
|---------------|----------|-------------|
| Listar ítems | `GET /api/order-items` | Lista todos los ítems de órdenes |
| Pendientes de análisis | `GET /api/order-items/pending-analysis` | Ítems en estado PENDIENTE o MUESTRA_TOMADA |
| Ver ítem | `GET /api/order-items/:id` | Obtiene detalle del ítem |
| Registrar muestra | `PUT /api/order-items/:id/sample` | Registra toma de muestra (tipo, fecha, responsable) |
| Cambiar estado | `PUT /api/order-items/:id/status` | Transición manual de estado |

**Ciclo de vida del ítem:**
```
PENDIENTE → MUESTRA_TOMADA → EN_ANALISIS → VALIDADO → ENTREGADO
                                                  ↕
                                        REQUIERE_CORRECCION
```

---

### 5. 🔬 Resultados Clínicos
**Roles permitidos:** LABORATORISTA (registrar) · VALIDADOR (validar/rechazar) · SECRETARIO (entregar) · Todos los roles con acceso (consultar)

| Funcionalidad | Endpoint | Descripción |
|---------------|----------|-------------|
| Registrar resultado | `POST /api/results` | Crea resultado para un ítem de orden |
| Listar resultados | `GET /api/results` | Lista todos los resultados |
| Pendientes validación | `GET /api/results/pending-validation` | Resultados en estado REGISTRADO |
| Ver resultado | `GET /api/results/:id` | Obtiene detalle del resultado |
| Actualizar resultado | `PATCH /api/results/:id` | Modifica valor (solo si está en REGISTRADO) |
| Validar resultado | `PATCH /api/results/:id/validate` | Validador aprueba el resultado |
| Rechazar resultado | `PATCH /api/results/:id/reject` | Validador rechaza, vuelve a laboratorista |
| Marcar entregado | `PATCH /api/results/:id/deliver` | Recepción registra la entrega al paciente |

**Evaluación Automática de Interpretación:**
- Busca el rango de referencia correspondiente según sexo y edad del paciente
- Asigna automáticamente: `NORMAL` · `ALTO` · `BAJO`
- Permite override manual por el laboratorista

**Ciclo de vida del resultado:**
```
REGISTRADO → VALIDADO → ENTREGADO
     ↓
  RECHAZADO (vuelve al laboratorista)
```

---

### 6. 📑 Reportes PDF
**Roles permitidos:** SECRETARIO, ADMINISTRADOR, MÉDICO

| Funcionalidad | Endpoint | Descripción |
|---------------|----------|-------------|
| PDF de orden completa | `GET /api/reports/order/:orderId/pdf` | Genera PDF con todos los resultados de la orden |
| PDF de resultado individual | `GET /api/reports/result/:resultId/pdf` | Genera PDF de un resultado específico |
| Hoja de petición | `GET /api/reports/orden-peticion/:orderId/pdf` | Formulario de petición de análisis para imprimir |

---

### 7. 📬 Notificaciones
**Roles permitidos:** SECRETARIO, ADMINISTRADOR

| Funcionalidad | Endpoint | Descripción |
|---------------|----------|-------------|
| Email — resultado | `POST /api/notifications/result/:id/email` | Envía resultado individual por email con PDF adjunto |
| Email — orden completa | `POST /api/notifications/order/:id/email` | Envía todos los resultados de la orden por email |
| WhatsApp — resultado | `POST /api/notifications/result/:id/whatsapp` | Notificación WhatsApp con enlace al resultado |
| WhatsApp — orden | `POST /api/notifications/order/:id/whatsapp` | Notificación WhatsApp con resumen de la orden |

**Proveedor:** Brevo (ex Sendinblue)
- SMTP: `smtp-relay.sendinblue.com:2525`
- REST API: `https://api.brevo.com/v3/smtp/email`
- WhatsApp API: `https://api.brevo.com/v2/whatsapp/send`

---

### 8. 🤖 Chatbot Informativo
**Acceso público** (pacientes)

| Funcionalidad | Endpoint | Descripción |
|---------------|----------|-------------|
| Enviar mensaje | `POST /api/chatbot` | Responde consultas automáticas de pacientes |

**Menú disponible:**
- 1️⃣ **Horarios** → Muestra el horario de atención del laboratorio
- 2️⃣ **Cotizaciones** → Busca exámenes por nombre y muestra precio + tipo de muestra
- 3️⃣ **Requisitos** → Muestra descripción y requisitos del examen consultado
- 🔗 **Default** → Redirige a WhatsApp para atención personalizada

---

### 9. 🔍 Auditoría
**Roles permitidos:** ADMINISTRADOR únicamente

| Funcionalidad | Endpoint | Descripción |
|---------------|----------|-------------|
| Listar logs | `GET /api/audit` | Lista logs con filtros por entidad, usuario y fecha |
| Histórico de entidad | `GET /api/audit/:entidad/:id` | Todos los cambios de un registro específico |

**Registra automáticamente:** CREATE · UPDATE · DELETE en todas las entidades del sistema

---

### 10. 👨‍💼 Gestión de Usuarios
**Roles permitidos:** ADMINISTRADOR únicamente

| Funcionalidad | Endpoint | Descripción |
|---------------|----------|-------------|
| Crear usuario | `POST /api/users` | Registra nuevo usuario en el sistema |
| Listar usuarios | `GET /api/users` | Lista todos los usuarios |
| Ver usuario | `GET /api/users/:id` | Obtiene datos del usuario |
| Actualizar usuario | `PATCH /api/users/:id` | Modifica datos del usuario |
| Eliminar usuario | `DELETE /api/users/:id` | Elimina usuario |
| Cambiar estado | `PUT /api/users/:id/status` | Activa o desactiva usuario (ACTIVE/INACTIVE) |
| Asignar roles | `PUT /api/users/:id/roles` | Asigna o quita roles al usuario |

---

### 11. 🛡️ Gestión de Roles
**Roles permitidos:** ADMINISTRADOR únicamente

| Funcionalidad | Endpoint | Descripción |
|---------------|----------|-------------|
| Crear rol | `POST /api/roles` | Crea un nuevo rol |
| Listar roles | `GET /api/roles` | Lista todos los roles del sistema |
| Ver rol | `GET /api/roles/:id` | Obtiene rol con sus usuarios asignados |
| Actualizar rol | `PATCH /api/roles/:id` | Modifica el nombre del rol |
| Eliminar rol | `DELETE /api/roles/:id` | Elimina el rol |

**Roles predefinidos del sistema:**

| Rol | Descripción |
|-----|-------------|
| `ADMINISTRADOR` | Acceso total al sistema |
| `LABORATORISTA` | Registrar y analizar resultados |
| `VALIDADOR` | Validar resultados clínicos |
| `RECEPCION` | Crear órdenes, registrar pacientes, enviar notificaciones |
| `MEDICO` | Consultar resultados de sus pacientes |
| `USUARIO` | Consultar sus propios datos |

---

### 12. 🔑 Autenticación
**Acceso público**

| Funcionalidad | Endpoint | Descripción |
|---------------|----------|-------------|
| Login | `POST /api/auth/login` | Genera token JWT con credenciales |
| Registro | `POST /api/auth/register` | Crea nuevo usuario con roles asignados |
| Perfil | `GET /api/auth/profile` | Retorna datos del usuario autenticado |

**Seguridad implementada:**
- Passwords hasheados con **bcrypt** (salt 10)
- Tokens **JWT** con vigencia de 7 días
- Headers de seguridad con **Helmet** (XSS, CSRF, clickjacking)
- **CORS** restringido a orígenes permitidos
- **ValidationPipe** con whitelist de DTOs

---

### 13. ❤️ Health Check
| Funcionalidad | Endpoint | Descripción |
|---------------|----------|-------------|
| Estado del servidor | `GET /api/health` | Retorna status, conexión BD, uptime y timestamp |

---

## 🔄 Flujos de Trabajo Principales

### Flujo Completo de una Orden

```
1. SECRETARIO registra al paciente
2. SECRETARIO crea la orden con los exámenes solicitados
3. [Opcional] Se imprime la hoja de petición (PDF)
4. LABORATORISTA registra la toma de cada muestra
5. LABORATORISTA realiza el análisis y registra resultados
6. VALIDADOR revisa y valida (o rechaza) cada resultado
7. SECRETARIO marca los resultados como entregados
8. SECRETARIO genera PDF y/o envía por Email o WhatsApp
9. La orden se cierra automáticamente
```

### Corrección de Resultados

```
LABORATORISTA registra resultado
     → VALIDADOR rechaza
     → LABORATORISTA corrige y vuelve a registrar
     → VALIDADOR valida
     → SECRETARIO entrega
```

---

## ⚙️ Datos Técnicos Relevantes

| Aspecto | Detalle |
|---------|---------|
| **Framework** | NestJS 10.0 |
| **Base de datos** | PostgreSQL + Prisma ORM |
| **Autenticación** | JWT + Passport.js |
| **Documentación API** | Swagger/OpenAPI en `/api/docs` |
| **Email** | Brevo (SMTP o API REST) |
| **WhatsApp** | Brevo WhatsApp API |
| **PDF** | docxtemplater + pdfkit |
| **Validación** | class-validator + class-transformer |
| **Seguridad** | Helmet + CORS + bcrypt |

---

*Última actualización del documento: Junio 2026 · Versión 1.0*