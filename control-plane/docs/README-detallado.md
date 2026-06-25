# Control Plane - Detalle funcional y técnico

Este documento conserva la información ampliada que antes estaba en el README principal. El README de raíz queda reservado para la consigna breve: descripción, deploy y acceso.

## Qué es esta app

El proyecto IAW 2026 está formado por varias aplicaciones independientes: RiderApp/RepairDash, DriverApp, Payments, Feedback y Promociones. Cada una conserva su propia base de datos y sus propios endpoints administrativos.

El Control Plane es el panel del súper administrador global. No tiene una base de datos propia para duplicar usuarios, viajes o transacciones: consulta y opera sobre cada app mediante APIs server-to-server. Su responsabilidad es orquestar información y acciones administrativas desde una única interfaz.

## Funcionalidades principales

### Autenticación y acceso

- Login con Clerk.
- Registro de usuarios deshabilitado.
- Acceso permitido solo para usuarios con `publicMetadata.role === "super-admin"`.
- Protección global para páginas y endpoints internos.

### Dashboard global

Resume métricas clave de todas las apps:

- Riders: clientes y viajes.
- Drivers: trabajadores, trabajos y tipos de servicio.
- Payments: comisión vigente, transacciones y retiros.
- Feedback: reportes, revisiones y disputas.
- Promociones: promociones y usos registrados.

### Payments

- Transacciones con filtros por estado y fecha.
- Retiros de drivers en modo consulta.
- Consulta y actualización de la comisión de la plataforma.
- Vista financiera de drivers y riders en modo lectura.

### Riders

- Listado de clientes registrados.
- Edición y eliminación de clientes.
- Historial de viajes con cliente, driver y estado.

### Drivers

- Listado de trabajadores.
- Cambio de estado operativo de trabajadores.
- Consulta de trabajos.
- Alta, edicion y baja de tipos de servicio.

### Promociones

- Creación, edición y baja lógica de promociones.
- Segmentación por fechas, categorías, tipo de descuento y flags.
- Historial de usos de promociones en modo lectura.

### Feedback

- Listado y detalle de reportes/disputas.
- Resolución de disputas desde el panel.

## Integración técnica

El Control Plane funciona como un BFF. El navegador llama a rutas internas del propio panel (`src/app/api/cp/*`) y esas rutas, desde el servidor, llaman a las APIs de cada app externa usando credenciales server-only.

Flujo general:

```text
Navegador -> /api/cp/* (Control Plane) -> API de la app externa
          cookie de sesión             API key + actor
```

Stack principal:

- Next.js 16 con App Router.
- React 19.
- TypeScript.
- Tailwind CSS 4.
- Clerk para autenticacion.

La autorización vive en `src/proxy.ts`: si no hay sesión, redirige al login; si el usuario no tiene rol `super-admin`, bloquea el acceso o responde `403` en APIs.

La configuración de apps externas está centralizada en `src/lib/server/config.ts`. Las API keys se leen desde variables de entorno sin prefijo `NEXT_PUBLIC_`, para que nunca lleguen al bundle del navegador.

Las operaciones de escritura viajan con actor y motivo (`reason`) para que la app destino pueda auditar quién realizó cada cambio y por qué.

Las tablas comparten búsqueda, filtros y paginación. El estado de cada vista vive en la URL, lo que permite compartir enlaces filtrados y navegar con atrás/adelante sin perder contexto.

El dashboard usa tags de revalidación para cachear métricas y refrescarlas cuando alguna mutación afecta a un dominio.
