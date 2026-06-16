import type { TableMeta } from "@/components/table/meta";

export const pdriversMeta: TableMeta = {
  group: "Usuarios",
  title: "Drivers (billeteras)",
  app: "Payments",
  tone: "mag",
  sub: "Estado financiero de los drivers en Payments: balances disponibles y bloqueados. Solo lectura.",
  search: "Buscar por nombre, email o CBU/CVU…",
  skeletonCols: 6,
  dataKey: "pdrivers",
};

export const pridersMeta: TableMeta = {
  group: "Usuarios",
  title: "Riders (pagos)",
  app: "Payments",
  tone: "mag",
  sub: "Riders con actividad de pago en Payments. Solo lectura.",
  search: "Buscar por nombre, email o Clerk ID…",
  skeletonCols: 5,
  dataKey: "priders",
};

export const transactionsMeta: TableMeta = {
  group: "Finanzas",
  title: "Transacciones",
  app: "Payments",
  tone: "mag",
  sub: "Transacciones de Payments con rider y driver asociados. Solo lectura en v1.",
  search: "Buscar por ID, trabajo, rider o driver…",
  statuses: [
    "PENDING",
    "RESERVED",
    "LIQUIDATED",
    "TRANSFERRED",
    "DISPUTED",
    "REFUNDED",
    "FAILED",
  ],
  dates: true,
  skeletonCols: 6,
  dataKey: "transactions",
};

export const withdrawalsMeta: TableMeta = {
  group: "Finanzas",
  title: "Retiros",
  app: "Payments",
  tone: "mag",
  sub: "Solicitudes de retiro de los drivers. La aprobación queda en el admin de Payments.",
  search: "Buscar por ID, driver o email…",
  statuses: ["REQUESTED", "APPROVED", "REJECTED"],
  dates: true,
  skeletonCols: 5,
  dataKey: "withdrawals",
};
