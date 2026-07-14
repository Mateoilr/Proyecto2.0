\# Guía de Colores para Etiquetas (Chips) del Sistema de Laboratorio Clínico



\## Objetivo



Este documento define la guía oficial de colores para todas las etiquetas (chips) utilizadas en el sistema del Laboratorio Clínico.



El objetivo es mantener una \*\*identidad visual consistente\*\*, mejorar la \*\*experiencia del usuario\*\*, facilitar la \*\*identificación rápida de estados\*\* y conservar una correcta armonía entre el modo claro y el modo oscuro.



> \*\*Importante:\*\* Este documento \*\*no modifica la lógica del sistema\*\*, únicamente redefine la identidad visual de las etiquetas existentes. \*\*No se agregan ni eliminan estados\*\*.



\---



\# Identidad Visual



\## Color Principal (Marca)



El sistema utiliza como color institucional el \*\*Verde Cerceta (Teal)\*\*.



\### Modo Claro



| Elemento | Color |

|----------|--------|

| Color principal | `#329d9c` |

| Variante oscura | `#277f7e` |

| Fondo principal | `#FFFFFF` |

| Fondo secundario | `#f4fbfb` |



\### Modo Oscuro



| Elemento | Color |

|----------|--------|

| Color principal | `#8fdbd9` |

| Variante secundaria | `#6ecfcb` |

| Fondo principal | `#121212` |

| Fondo secundario | `#1c1c1c` |



\---



\# Principios de Diseño



Las etiquetas deben seguir las siguientes reglas:



\- El color institucional representa información normal del sistema.

\- El verde representa procesos finalizados correctamente.

\- El azul representa procesos activos.

\- El amarillo representa espera o atención requerida.

\- El rojo representa errores o cancelaciones.

\- El gris representa estados finales sin actividad o informativos.



De esta forma el usuario identifica el estado sin necesidad de leer completamente la etiqueta.



\---



\# Paleta Semántica Oficial



\## Modo Claro



| Significado | Fondo | Texto |

|-------------|---------|--------|

| Institucional | `#329d9c` | `#FFFFFF` |

| Proceso | `#2D7FF9` | `#FFFFFF` |

| Éxito | `#2E8B57` | `#FFFFFF` |

| Advertencia | `#E6A700` | `#FFFFFF` |

| Error | `#D64545` | `#FFFFFF` |

| Neutral | `#6B7280` | `#FFFFFF` |



\## Modo Oscuro



| Significado | Fondo | Texto |

|-------------|---------|--------|

| Institucional | `#8fdbd9` | `#0F172A` |

| Proceso | `#6EA8FE` | `#0F172A` |

| Éxito | `#6FCF97` | `#0F172A` |

| Advertencia | `#F4C95D` | `#0F172A` |

| Error | `#F28B82` | `#0F172A` |

| Neutral | `#B0B7C3` | `#0F172A` |



\---



\# 1. Estados de la Orden



Representan el ciclo de vida completo de una orden de laboratorio.



| Estado | Modo Claro | Modo Oscuro | Justificación |

|---------|------------|-------------|---------------|

| \*\*CREADA\*\* | `#329d9c` | `#8fdbd9` | Estado inicial del sistema. Utiliza el color institucional. |

| \*\*EN\_PROCESO\*\* | `#2D7FF9` | `#6EA8FE` | Indica actividad en curso. |

| \*\*COMPLETADA\*\* | `#2E8B57` | `#6FCF97` | Representa éxito. |

| \*\*CERRADA\*\* | `#6B7280` | `#B0B7C3` | Estado administrativo final. |

| \*\*CANCELADA\*\* | `#D64545` | `#F28B82` | Estado cancelado o inválido. |



\---



\# 2. Estados del Examen Individual



Representan el estado de cada examen dentro de una orden.



| Estado | Modo Claro | Modo Oscuro | Justificación |

|---------|------------|-------------|---------------|

| \*\*PENDIENTE\*\* | `#E6A700` | `#F4C95D` | Esperando procesamiento. |

| \*\*EN\_PROCESO\*\* | `#2D7FF9` | `#6EA8FE` | El examen está siendo realizado. |

| \*\*COMPLETADO\*\* | `#2E8B57` | `#6FCF97` | Examen terminado correctamente. |

| \*\*CANCELADO\*\* | `#D64545` | `#F28B82` | Examen descartado. |



\---



\# 3. Estados de Resultados



Representan el flujo de validación clínica.



| Estado | Modo Claro | Modo Oscuro | Justificación |

|---------|------------|-------------|---------------|

| \*\*REGISTRADO\*\* | `#329d9c` | `#8fdbd9` | Resultado almacenado en el sistema. |

| \*\*VALIDADO\*\* | `#2E8B57` | `#6FCF97` | Resultado aprobado oficialmente. |

| \*\*RECHAZADO\*\* | `#D64545` | `#F28B82` | Requiere corrección o repetición. |

| \*\*ENTREGADO\*\* | `#6B7280` | `#B0B7C3` | Resultado entregado al paciente. |



\---



\# 4. Prioridad de la Orden



| Prioridad | Modo Claro | Modo Oscuro | Justificación |

|------------|------------|-------------|---------------|

| \*\*NORMAL\*\* | `#329d9c` | `#8fdbd9` | Prioridad estándar del laboratorio. |

| \*\*URGENTE\*\* | `#D64545` | `#F28B82` | Requiere atención inmediata. |



\---



\# 5. Roles de Usuario



Los roles representan categorías funcionales dentro del sistema.



Para mantener una interfaz limpia y consistente, cada rol utiliza un color diferenciado.



| Rol | Modo Claro | Modo Oscuro | Justificación |

|------|------------|-------------|---------------|

| \*\*ADMIN\*\* | `#5B21B6` | `#C4B5FD` | Rol con privilegios administrativos. |

| \*\*SECRETARIO\*\* | `#329d9c` | `#8fdbd9` | Relacionado con la gestión y recepción. |

| \*\*LABORATORISTA\*\* | `#2D7FF9` | `#6EA8FE` | Asociado al procesamiento de exámenes. |

| \*\*MEDICO\*\* | `#2E8B57` | `#6FCF97` | Responsable de la validación clínica. |



\---



\# 6. Acciones de Auditoría



Representan las acciones registradas en el historial del sistema.



| Acción | Modo Claro | Modo Oscuro | Justificación |

|---------|------------|-------------|---------------|

| \*\*CREATE\*\* | `#2E8B57` | `#6FCF97` | Se creó información nueva. |

| \*\*UPDATE\*\* | `#329d9c` | `#8fdbd9` | Se modificó información existente. |

| \*\*DELETE\*\* | `#D64545` | `#F28B82` | Eliminación de registros. |

| \*\*LOGIN\*\* | `#2D7FF9` | `#6EA8FE` | Inicio de sesión del usuario. |

| \*\*LOGOUT\*\* | `#6B7280` | `#B0B7C3` | Cierre de sesión del usuario. |



\---



\# Reglas de Accesibilidad



Todas las etiquetas deberán cumplir las siguientes normas:



\- Mantener un contraste suficiente entre fondo y texto.

\- Utilizar texto blanco en modo claro.

\- Utilizar texto oscuro (`#0F172A`) en modo oscuro para colores claros.

\- Mantener el mismo tamaño de fuente en todas las etiquetas.

\- Usar bordes completamente redondeados (`border-radius: 999px`).

\- Conservar el mismo espaciado interno (`padding`) en todas las etiquetas.

\- No utilizar distintos colores para un mismo significado en diferentes módulos.



\---



\# Consistencia Visual



La siguiente relación de colores deberá mantenerse en todo el sistema.



| Significado | Color |

|-------------|--------|

| Información / Creado / Registrado / Normal | Verde Cerceta (Color Institucional) |

| Procesando | Azul |

| Finalizado correctamente | Verde |

| Esperando acción | Amarillo |

| Error / Cancelado / Rechazado | Rojo |

| Estado administrativo / Informativo | Gris |



\---



\# Resumen General



\## Modo Claro



| Color | Hex |

|--------|-----|

| Institucional | `#329d9c` |

| Proceso | `#2D7FF9` |

| Éxito | `#2E8B57` |

| Advertencia | `#E6A700` |

| Error | `#D64545` |

| Neutral | `#6B7280` |



\## Modo Oscuro



| Color | Hex |

|--------|-----|

| Institucional | `#8fdbd9` |

| Proceso | `#6EA8FE` |

| Éxito | `#6FCF97` |

| Advertencia | `#F4C95D` |

| Error | `#F28B82` |

| Neutral | `#B0B7C3` |



\---



\# Resultado Esperado



Con esta guía se consigue:



\- Una identidad visual alineada con el color institucional del laboratorio.

\- Consistencia visual entre todos los módulos.

\- Una interfaz moderna, limpia y profesional.

\- Estados fácilmente identificables mediante colores semánticos.

\- Una experiencia uniforme tanto en modo claro como en modo oscuro.

\- Una base de diseño escalable para futuras funcionalidades sin perder armonía visual.

