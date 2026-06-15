import type { TableMeta } from '@/components/table/meta';

export const promotionsMeta: TableMeta = {
  group: 'Plataforma', title: 'Promociones', app: 'Promociones', tone: 'pink',
  endpoint: 'GET /api/admin/promociones',
  sub: 'Catálogo global de promociones. Como SuperAdmin podés crear, editar y dar de baja (soft delete) cualquier promoción del sistema.',
  search: 'Buscar por nombre, descripción o categoría…',
  statuses: ['activa', 'vencida', 'programada', 'eliminada'],
  create: true, createLabel: '+ Nueva promoción', dataKey: 'promotions',
};

export const historialMeta: TableMeta = {
  group: 'Plataforma', title: 'Historial de promos', app: 'Promociones', tone: 'pink',
  endpoint: 'GET /api/historial',
  sub: 'Registro de usos de promociones por los riders, con el trabajo asociado y el ahorro aplicado. Solo lectura.',
  search: 'Buscar por promoción, usuario o trabajo…', dates: true, dataKey: 'promoHistory',
};
