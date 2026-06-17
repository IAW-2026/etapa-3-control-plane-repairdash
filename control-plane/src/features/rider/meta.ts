import type { TableMeta } from "@/components/table/meta";

export const clientesMeta: TableMeta = {
  group: "Usuarios",
  title: "Clientes",
  app: "RiderApp",
  tone: "pink",
  sub: "Clientes registrados en RiderApp. Podés editar nombre y apellido o eliminar el registro.",
  search: "Buscar por nombre, email o Clerk ID…",
  dataKey: "clientes",
};

export const viajesMeta: TableMeta = {
  group: "Operaciones",
  title: "Viajes",
  app: "RiderApp",
  tone: "pink",
  sub: "Viajes del sistema según RepairDash, con el cliente asociado y sus pagos.",
  search: "Buscar por cliente, driver o tipo…",
  statuses: ["pendiente", "en curso", "concluido", "cancelado"],
  dataKey: "viajes",
};
