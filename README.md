# control-plane

Aplicación **Control Plane** del [Proyecto IAW 2026](https://etapa-3-control-plane-repairdash.vercel.app/) — comisión `RepairDash`.

Usuario admin: [controlplane+clerk_test@iaw.com]  
Contraseña admin: [Iawuser#]

Panel administrativo centralizado (Etapa 3): gestión unificada de todas las apps, activación/desactivación de usuarios y resolución de disputas.

## ¿Qué es esta app?

El proyecto IAW 2026 está formado por varias aplicaciones independientes (la app de Riders **RepairDash**, la **DriverApp**, **Payments**, **Feedback** y **Promociones**), cada una con su propia base de datos y su propio panel de administración acotado a su dominio.

El **Control Plane** es el panel del **súper administrador global**: el único lugar desde donde una persona con permisos máximos puede ver y operar **todas** las apps a la vez, sin tener que entrar a cada una por separado.

La idea central es que **el Control Plane no tiene base de datos propia**. No guarda usuarios, viajes ni transacciones: cuando necesita un dato, se lo pide en vivo a la app dueña de ese dato a través de su API; y cuando se hace un cambio (por ejemplo, desactivar un trabajador), le ordena a esa app que lo aplique. El Control Plane es, entonces, un **orquestador**: consolida información de muchas fuentes y centraliza las acciones administrativas que cruzan más de una app.

---

## Funcionalidades

### 🔐 Autenticación y control de acceso

El acceso está restringido al rol de súper administrador:

- El login se hace con **Clerk**. El **registro de nuevos usuarios está deshabilitado**: cualquier intento de sign-up se redirige al login.
- Solo pueden entrar los usuarios cuyo rol en Clerk sea `super-admin` (`publicMetadata.role === "super-admin"`). Cualquier otro usuario autenticado es enviado a la pantalla `/unauthorized`.
- La verificación se aplica de forma **global**: protege tanto las páginas del panel como las APIs internas. Un usuario sin permisos no solo no ve las pantallas, tampoco puede llamar a los endpoints.

### 📊 Dashboard global

La pantalla principal es un **resumen consolidado** que junta, en una sola vista, las métricas clave de todas las apps:

- **Riders (RepairDash):** cantidad de clientes y de viajes.
- **Drivers (DriverApp):** trabajadores, trabajos y tipos de servicio.
- **Payments:** comisión vigente de la plataforma y conteo de transacciones y retiros agrupados por estado.
- **Feedback:** reportes abiertos, en revisión y resueltos, y reviews pendientes.
- **Promociones:** total de promociones y de usos registrados.

Es la foto rápida del estado de toda la plataforma para el súper admin.

### 💳 Payments (Finanzas)

- **Transacciones:** listado de todas las transacciones de la plataforma, con rider y driver asociados, y filtro por estado (`PENDING`, `RESERVED`, `LIQUIDATED`, `TRANSFERRED`, `DISPUTED`, `REFUNDED`, `FAILED`) y por fecha. _Solo lectura._
- **Retiros:** solicitudes de retiro de los drivers, filtrables por estado (`REQUESTED`, `APPROVED`, `REJECTED`). La aprobación efectiva queda en el panel de Payments; acá se consultan y siguen.
- **Comisión:** se puede **consultar y modificar** la tasa de comisión que cobra la plataforma. Es una de las acciones de escritura más sensibles, porque afecta a todas las apps.
- **Drivers (billeteras):** estado financiero de cada driver (balances disponibles y bloqueados). _Solo lectura._
- **Riders (pagos):** riders con actividad de pago. _Solo lectura._

### 🚖 Riders (RiderApp)

- **Clientes:** listado de clientes registrados en RiderApp. Se puede **editar** (nombre y apellido) y **eliminar** registros.
- **Viajes:** historial de viajes del sistema, con el cliente asociado, el driver y el estado del viaje (`pendiente`, `en curso`, `concluido`, `cancelado`).

### 🔧 Drivers (DriverApp)

- **Trabajadores:** listado de drivers, donde el súper admin puede **activar o desactivar el estado operativo** de un trabajador (`ONLINE`, `OFFLINE`, `EN_TRABAJO`).
- **Trabajos:** trabajos solicitados, con su rider, el driver asignado y el estado del flujo (`PENDIENTE`, `ACEPTADO`, `RECHAZADO`, `EN_CAMINO`, `EN_SERVICIO`, `FINALIZADO`, `CANCELADO`).
- **Tipos de servicio:** catálogo comercial de la DriverApp. Se pueden **crear, editar y dar de baja** tipos de servicio.

### 🎟️ Promotions

- **Promociones:** catálogo global de promociones. El súper admin puede **crear, editar y dar de baja** (baja lógica / _soft delete_) cualquier promoción del sistema. Cada promoción define tipo de descuento (porcentaje o monto fijo), valor, descripción, vigencia (fecha de inicio y fin), categorías de servicio a las que aplica, segmentación de usuarios, y flags de _destacada_ y _uso único_. El filtro permite ver promociones `activa`, `vencida`, `programada` o `eliminada`.
- **Historial de promos:** registro de los usos de promociones por parte de los riders, con el trabajo asociado y el ahorro aplicado. _Solo lectura._

### 💬 Feedback

- **Reportes / disputas:** listado de reportes con su detalle completo (personas involucradas, trabajo relacionado y evidencia adjunta). El súper admin puede **resolver una disputa** tomando una decisión, que se comunica de vuelta a la app de Feedback.

### 🧭 Experiencia de uso de las tablas

Todas las secciones de listado comparten la misma mecánica:

- **Búsqueda, filtros (por estado/fecha) y paginación**, renderizados en el servidor.
- El estado de la búsqueda y los filtros **vive en la URL**, por lo que una vista filtrada se puede compartir por link y los botones de atrás/adelante del navegador funcionan como uno espera.

---

## Cómo se integraron las funcionalidades

El Control Plane funciona como un **BFF (Backend for Frontend)**. El navegador **nunca** se comunica directamente con las apps externas: habla con las rutas internas del propio Control Plane (`src/app/api/cp/*`), y son esas rutas, ya en el servidor, las que llaman a cada app. Este diseño cumple dos objetivos: mantener las credenciales fuera del cliente y darle al panel un formato de datos uniforme, sin importar cómo responda cada app.

A grandes rasgos, el flujo es:

```
Navegador  →  /api/cp/*  (Control Plane, server)  →  API de la app externa
            (cookie de sesión)        (API key + actor)
```

**Stack técnico.** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4. La autenticación es de Clerk.

**Autenticación y autorización (Clerk).** Toda la verificación de sesión y de rol vive en `src/proxy.ts` (en Next.js 16 el antiguo _middleware_ pasó a llamarse `proxy`). Ahí Clerk intercepta cada request: rechaza a quien no esté logueado y a quien no tenga rol `super-admin`, antes de que se ejecute cualquier página o endpoint. Es la barrera que protege todo el panel desde un solo lugar.

**Conexión con cada app externa.** Cada dominio se consume desde su propio _route handler_ en `src/app/api/cp/*` (por ejemplo, `api/cp/workers` para los trabajadores de DriverApp, `api/cp/transactions` para Payments, etc.). La configuración de cada app —su **URL base**, su **API key** y la **cabecera** particular que espera— está centralizada en `src/lib/server/config.ts`. Estos valores se leen de variables de entorno **solo de servidor** (sin el prefijo `NEXT_PUBLIC_`, ver `control-plane/.env.example`), de modo que las API keys nunca se incluyen en el bundle que llega al navegador.

**Auditoría de las acciones.** Cada operación de escritura (cambiar el estado de un trabajador, resolver una disputa, actualizar la comisión, crear o editar una promoción) viaja a la app de destino acompañada de un **actor** (el clerkId y el email del súper admin) y de un **motivo** (`reason`). Así, la app que efectivamente aplica el cambio puede registrar _quién_ lo hizo y _por qué_.

**Carga de datos en las pantallas.** Las páginas son **Server Components**: piden los datos a las rutas internas mediante `src/lib/server/list-data.ts`, que normaliza todas las respuestas al mismo formato `{ items, total, totalPages }`. De esa forma, una única implementación de tabla sirve para todas las secciones, sin importar las diferencias entre las APIs originales.

**Caché e invalidación.** El dashboard cachea sus métricas usando _tags_ de revalidación (`src/lib/server/cache.ts`), para no golpear todas las apps en cada carga. Cuando se hace una mutación, el endpoint correspondiente invalida (`revalidateTag`) tanto el dominio afectado como el resumen general, de manera que las métricas se actualizan tras cada cambio.

**Resiliencia.** Si alguna app no está configurada (faltan sus variables de entorno) o falla al responder, su sección **degrada de forma elegante**: devuelve listas vacías o valores nulos en vez de romper. El resto del panel sigue funcionando con normalidad.

---
