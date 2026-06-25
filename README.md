# Control Plane

Aplicación web de **súper administración global** del ecosistema RepairDash. Centraliza en un solo panel la consulta y gestión operativa de las apps de Riders, Drivers, Payments, Feedback y Promociones.

## Deploy

[https://etapa-3-control-plane-repairdash.vercel.app/](https://etapa-3-control-plane-repairdash.vercel.app/)

## Acceso

El panel usa Clerk y solo permite entrar a usuarios con rol `super-admin`.

| Tipo de usuario | Acceso |
| --- | --- |
| Súper administrador | Usuario: `controlplane+clerk_test@iaw.com` / Contraseña: `Iawuser#` |
| Usuario final | No aplica dentro de este panel. Riders, drivers y otros usuarios finales se gestionan desde sus apps correspondientes; si intentan entrar al Control Plane sin rol `super-admin`, son redirigidos a `/unauthorized`. |

## Resumen

Desde el Control Plane se pueden ver métricas generales, consultar tablas con búsqueda/filtros/paginación y ejecutar acciones administrativas como actualizar comisiones, administrar promociones, modificar clientes, cambiar estados de trabajadores y resolver disputas.

Más detalle funcional y técnico: [control-plane/docs/README-detallado.md](control-plane/docs/README-detallado.md).
