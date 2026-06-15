import type { TableMeta } from '@/components/table/meta';

export const clientesMeta: TableMeta = {
  group: 'Usuarios', title: 'Clientes', app: 'RepairDash', tone: 'pink',
  endpoint: 'GET /api/super-admin/clientes',
  sub: 'Clientes registrados en RepairDash (Rider app). Podés editar nombre y apellido o eliminar el registro.',
  search: 'Buscar por nombre, email o Clerk ID…', dataKey: 'clientes',
};

export const viajesMeta: TableMeta = {
  group: 'Operaciones', title: 'Viajes', app: 'RepairDash', tone: 'pink',
  endpoint: 'GET /api/super-admin/viajes',
  sub: 'Viajes del sistema según RepairDash, con el cliente asociado y sus pagos.',
  search: 'Buscar por cliente, driver o tipo…',
  statuses: ['pendiente', 'en curso', 'concluido', 'cancelado'], dataKey: 'viajes',
};
