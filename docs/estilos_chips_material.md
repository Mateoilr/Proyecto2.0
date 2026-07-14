# Guía para personalizar estilos de Etiquetas (Chips) en Angular Material MDC

A partir de Angular 15, Angular Material migró a los componentes basados en Material Design Components (MDC) para la web. Esto cambió radicalmente la forma en la que se estructuran los componentes por dentro (su DOM interno) y cómo se aplican los estilos personalizados.

## El problema con `color: white` directo

Cuando usas un componente `<mat-chip>`, Angular Material genera internamente una estructura HTML más compleja. 

**¿Qué pasa cuando aplicas CSS directo?**
- Si aplicas una clase CSS al chip directamente (ej. `.estado-creada { background-color: blue; }`), el color de fondo sí se aplica al contenedor principal del chip porque afecta a la etiqueta superior.
- **Sin embargo**, el **color del texto** suele estar protegido por una clase interna de MDC (`.mdc-evolution-chip__text-label`), la cual tiene mayor prioridad en la cascada de CSS. Por lo tanto, tu regla `color: white;` es ignorada y aplastada por el estilo predeterminado de Material.

---

## Opciones para personalizar el diseño general de los estados

Dado que la mejor práctica es no forzar (`!important` o `::ng-deep`) los estilos directamente en el archivo del componente local, aquí te detallo las formas recomendadas y "limpias" de hacerlo a nivel de proyecto:

### Opción 1: Usar Variables CSS Nativas de MDC (Recomendado)
Los componentes MDC de Angular Material exponen una lista de **Custom Properties** (Variables CSS) oficiales. 
**Descripción:** Estas variables te permiten decirle internamente al componente qué colores debe usar sin necesidad de conocer su estructura HTML interna. Debes sobrescribir estas variables en tu archivo global (generalmente `src/styles.css` o `styles.scss`).

En tu `styles.css` global puedes definir las variables del chip de la siguiente manera:

```css
/* Personalizar chips globalmente para toda la aplicación */
/* Descripción: Esta variable '--mdc-chip-label-text-color' le dice a cualquier chip de Material que el color de su texto interno debe ser blanco (#ffffff). */
.mat-mdc-chip {
  --mdc-chip-label-text-color: #ffffff; 
}

/* O personalizar solo las clases específicas de los estados globalmente */
/* Descripción: Aquí estamos diciendo que cuando un chip tenga la clase '.estado-creada', su fondo elevado será azul y su texto blanco. */
.estado-creada {
  --mdc-chip-elevated-container-color: #2196f3;
  --mdc-chip-label-text-color: #ffffff;
}

.estado-en-proceso {
  --mdc-chip-elevated-container-color: #ff9800;
  --mdc-chip-label-text-color: #ffffff;
}
```

**Ventaja:** Al hacerlo de esta forma, Angular Material sabe internamente cómo mapear estas variables a su estructura HTML sin necesidad de romper la encapsulación de los componentes ni usar reglas forzadas.

---

### Opción 2: Anulación global de clases (Global Overrides)
Si necesitas hacer una personalización muy profunda (como márgenes internos o bordes extraños) y las variables CSS nativas no te alcanzan.

**Descripción:** La forma recomendada es colocar tus selectores profundos en tu archivo `styles.css` global (la hoja de estilos de toda la aplicación, **no** la hoja `.css` del componente individual). 
Al poner estas reglas en el archivo global, **no necesitas usar `::ng-deep`**. Cabe resaltar que `::ng-deep` es una herramienta que Angular planea eliminar (está en proceso de ser obsoleto - *deprecated*), por lo que se debe evitar su uso en archivos locales de componentes.

```css
/* En styles.css / src/styles.css */
/* Descripción: Este selector apunta directamente al elemento HTML interno (.mdc-evolution-chip__text-label) dentro de un chip que tenga la clase .estado-creada, forzando el color blanco. */
.mat-mdc-chip.estado-creada .mdc-evolution-chip__text-label {
  color: white !important;
}

.mat-mdc-chip.estado-en-proceso .mdc-evolution-chip__text-label {
  color: white !important;
}
```

---

## Aplicando esto a las Etiquetas de Roles (Usuarios)

El mismo principio descrito arriba aplica exactamente igual a los roles en la gestión de usuarios (ej. `ADMIN`, `SECRETARIO`, `LABORATORISTA`). Si tienes clases de CSS que aplican color de fondo a los roles (por ejemplo `.rol-admin`), el texto también quedará protegido por MDC y se verá negro/gris por defecto.

**Descripción:** Para cambiar el color del texto de las etiquetas de rol a nivel global, debes agregar las variables a tu archivo `styles.css`:

```css
/* Opción Recomendada: Usando Variables CSS para los Roles */
/* Descripción: Agrupa todas las clases de roles y fuérzalas a usar el texto en blanco usando la variable nativa de MDC. */
.rol-admin, .rol-secretario, .rol-laboratorista, .rol-medico {
  --mdc-chip-label-text-color: #ffffff;
}

/* Opción Alternativa: Usando selectores globales (sin ::ng-deep) */
/* Descripción: Si por alguna razón la variable falla, apunta al contenedor de texto interno de MDC directamente desde tu CSS global. */
.mat-mdc-chip.rol-admin .mdc-evolution-chip__text-label,
.mat-mdc-chip.rol-secretario .mdc-evolution-chip__text-label,
.mat-mdc-chip.rol-laboratorista .mdc-evolution-chip__text-label,
.mat-mdc-chip.rol-medico .mdc-evolution-chip__text-label {
  color: white !important;
}
```

---

## Aplicando esto a las Etiquetas de Acción en Auditoría

De forma similar, en la tabla del historial de **Auditoría**, las acciones como `CREATE`, `UPDATE`, `DELETE`, o `LOGIN` se representan frecuentemente como chips. Puedes cambiar el color de su texto utilizando exactamente el mismo principio de variables.

**Descripción:** Si tienes clases en tu HTML como `.accion-create` o `.accion-delete`, agrégalas a tu archivo global `styles.css` de esta forma:

```css
/* Opción Recomendada: Usando Variables CSS para las Acciones de Auditoría */

/* Descripción: Verde para creaciones, con texto blanco */
.accion-create {
  --mdc-chip-elevated-container-color: #4caf50;
  --mdc-chip-label-text-color: #ffffff;
}

/* Descripción: Naranja para actualizaciones, con texto blanco */
.accion-update {
  --mdc-chip-elevated-container-color: #ff9800;
  --mdc-chip-label-text-color: #ffffff;
}

/* Descripción: Rojo para eliminaciones, con texto blanco */
.accion-delete {
  --mdc-chip-elevated-container-color: #f44336;
  --mdc-chip-label-text-color: #ffffff;
}

/* Descripción: Azul para inicios de sesión, con texto blanco */
.accion-login {
  --mdc-chip-elevated-container-color: #2196f3;## Inventario de Etiquetas en el Sistema

A continuación, se detalla el listado completo de todos los chips (etiquetas) utilizados en el sistema, a qué módulo pertenecen, qué representan lógicamente y su configuración de colores exacta:

### 1. Estados de la Orden (Módulo de Órdenes Generales)
Representan el ciclo de vida principal de una solicitud de laboratorio completa.
- **`CREADA`**: La orden acaba de ser registrada en recepción. Aún no se han procesado muestras ni exámenes.
  - **Color de fondo:** Azul (`#2196f3`)
  - **Color de texto:** Blanco (`#ffffff`)
- **`EN_PROCESO`**: Se han empezado a procesar muestras o se han registrado resultados parciales, pero la orden no está terminada.
  - **Color de fondo:** Naranja (`#ff9800`)
  - **Color de texto:** Blanco (`#ffffff`)
- **`COMPLETADA`**: Absolutamente todos los exámenes solicitados en esta orden ya tienen un resultado registrado y validado.
  - **Color de fondo:** Verde Éxito (`#4caf50`)
  - **Color de texto:** Blanco (`#ffffff`)
- **`CERRADA`**: La orden fue finalizada administrativamente y (opcionalmente) notificada al paciente. El ciclo se cierra y ya no se permiten ediciones.
  - **Color de fondo:** Gris (`#9e9e9e`)
  - **Color de texto:** Blanco (`#ffffff`)
- **`CANCELADA`**: La orden fue anulada por un error administrativo o a petición del paciente. No se elimina de la base de datos (por auditoría) pero queda inactiva.
  - **Color de fondo:** Rojo Alerta (`#f44336`)
  - **Color de texto:** Blanco (`#ffffff`)

### 2. Estados del Examen Individual (Módulo de Detalle de Órdenes)
Cada orden contiene varios exámenes, y cada examen tiene su propio estado independiente (antes de que se generen sus resultados).
- **`PENDIENTE`**: El examen fue solicitado pero el laboratorista aún no ha interactuado con él.
  - **Color de fondo:** Naranja Oscuro/Ámbar (`#ff9800`)
  - **Color de texto:** Blanco (`#ffffff`)
- **`EN_PROCESO`**: El laboratorista está analizando la muestra o escribiendo el resultado.
  - **Color de fondo:** Azul (`#2196f3`)
  - **Color de texto:** Blanco (`#ffffff`)
- **`COMPLETADO`**: El examen ya tiene su resultado redactado y guardado.
  - **Color de fondo:** Verde Éxito (`#4caf50`)
  - **Color de texto:** Blanco (`#ffffff`)
- **`CANCELADO`**: El examen específico fue descartado (por muestra insuficiente, decisión médica, etc.).
  - **Color de fondo:** Rojo Alerta (`#f44336`)
  - **Color de texto:** Blanco (`#ffffff`)

### 3. Estados de los Resultados de Exámenes (Validación Médica)
Una vez que un laboratorista ingresa el valor de un examen, se genera un registro de "Resultado" que pasa por el siguiente flujo:
- **`REGISTRADO`**: El laboratorista ingresó el resultado, pero aún debe ser revisado por un médico.
  - **Color de fondo:** Azul (`#2196f3`)
  - **Color de texto:** Blanco (`#ffffff`)
- **`VALIDADO`**: El médico o jefe de laboratorio revisó el resultado clínico y le dio el visto bueno. Ya es oficial.
  - **Color de fondo:** Verde Éxito (`#4caf50`)
  - **Color de texto:** Blanco (`#ffffff`)
- **`RECHAZADO`**: El resultado no tiene sentido clínico o hubo un error, se envía a repetir.
  - **Color de fondo:** Rojo Alerta (`#f44336`)
  - **Color de texto:** Blanco (`#ffffff`)
- **`ENTREGADO`**: El paciente ya recibió oficialmente este resultado.
  - **Color de fondo:** Gris (`#9e9e9e`)
  - **Color de texto:** Blanco (`#ffffff`)

### 4. Prioridad de la Orden (Módulo de Recepción)
- **`NORMAL`**: Sigue la cola de procesamiento y tiempos de entrega estándar del laboratorio.
  - **Color de fondo:** Verde Éxito (`#4caf50`)
  - **Color de texto:** Blanco (`#ffffff`)
- **`URGENTE`**: Resalta de inmediato en el panel del laboratorista para ser procesado de emergencia (ej. pacientes de UCI).
  - **Color de fondo:** Rojo Alerta (`#f44336`)
  - **Color de texto:** Blanco (`#ffffff`)

### 5. Roles de Usuario (Módulo de Administración y Seguridad)
Actualmente los roles utilizan el formato por defecto de Angular Material (Gris claro con texto oscuro) a menos que se les aplique una clase personalizada como se indica en la guía superior.
- **`ADMIN`**: Tiene control total. Puede ver todos los paneles, auditar, crear usuarios, gestionar el catálogo de exámenes, y ver contadores.
- **`SECRETARIO`**: Enfocado en recepción. Puede crear pacientes, emitir órdenes nuevas, cobrar, e imprimir o enviar reportes.
- **`LABORATORISTA`**: Enfocado en el área técnica. Revisa órdenes pendientes y digita resultados en el sistema.
- **`MEDICO`**: Rol consultivo/validador. Revisa resultados clínicos para darles visto bueno antes de que se consideren oficiales.

### 6. Acciones de Auditoría (Módulo de Logs / Seguridad)
Reflejan las huellas digitales exactas de lo que ocurre en el sistema (trazabilidad).
- **`CREATE`**: Se insertó información nueva (se creó un paciente, una orden, un resultado).
  - **Color de fondo:** Verde Éxito (`#4caf50`)
  - **Color de texto:** Blanco (`#ffffff`)
- **`UPDATE`**: Alguien modificó datos existentes (editó un paciente, corrigió un resultado).
  - **Color de fondo:** Naranja (`#ff9800`)
  - **Color de texto:** Blanco (`#ffffff`)
- **`DELETE`**: Alguien eliminó información del sistema de manera irreversible.
  - **Color de fondo:** Rojo Alerta (`#f44336`)
  - **Color de texto:** Blanco (`#ffffff`)
- **`LOGIN` / `LOGOUT`**: Eventos de autenticación de seguridad (entradas y salidas de usuarios del sistema).
  - **Color de fondo:** Azul (`#2196f3`)
  - **Color de texto:** Blanco (`#ffffff`)

---

### Opción 3: Tematización formal de Angular Material (Sass)
**Descripción:** Si tu proyecto está configurado con preprocesadores Sass (`.scss`), puedes crear un tema secundario ("mixin") para tus chips y aplicarlo en el archivo global `_theme.scss` de Angular Material. Esta es la práctica más "pura" y robusta según los estándares de Angular, pero requiere una curva de aprendizaje mayor y mucha más configuración arquitectónica.

### Resumen final
La regla de oro en Angular 15+: **No intentes modificar estilos de los componentes internos de Angular Material directamente desde el `.css` de tu componente local**. Hazlo siempre desde los estilos globales (`styles.css`) usando variables `--mdc` siempre que sea posible.
