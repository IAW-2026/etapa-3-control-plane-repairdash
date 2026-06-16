import type { TableMeta } from "@/components/table/meta";

export const workersMeta: TableMeta = {
  group: "Usuarios",
  title: "Trabajadores",
  app: "DriverApp",
  tone: "violet",
  sub: "Trabajadores de DriverApp. Desde acá podés activar o desactivar su estado operativo.",
  search: "Buscar por nombre, email o Clerk ID…",
  statuses: ["ONLINE", "OFFLINE", "EN_TRABAJO"],
  skeletonCols: 6,
  dataKey: "workers",
};

export const jobsMeta: TableMeta = {
  group: "Operaciones",
  title: "Trabajos",
  app: "DriverApp",
  tone: "violet",
  sub: "Trabajos solicitados en DriverApp con su rider, driver asignado y estado del flujo.",
  search: "Buscar por ID, rider o dirección…",
  statuses: [
    "PENDIENTE",
    "ACEPTADO",
    "RECHAZADO",
    "EN_CAMINO",
    "EN_SERVICIO",
    "FINALIZADO",
    "CANCELADO",
  ],
  skeletonCols: 7,
  dataKey: "jobs",
};

export const servicesMeta: TableMeta = {
  group: "Operaciones",
  title: "Tipos de servicio",
  app: "DriverApp",
  tone: "violet",
  sub: "Catálogo comercial de DriverApp. Podés crear, editar y dar de baja tipos de servicio.",
  search: "Buscar por nombre o descripción…",
  create: true,
  createLabel: "+ Nuevo tipo de servicio",
  skeletonCols: 5,
  dataKey: "serviceTypes",
};
