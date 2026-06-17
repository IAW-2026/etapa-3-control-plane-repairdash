import type { SummaryData } from '@/lib/types';
import { STATUS_META } from '@/lib/utils';
import type { DashboardModel, DashboardNavigate } from './types';

const n = (v: number | null | undefined) => (v == null ? '---' : v);
const sumValues = (o: Record<string, number> | null | undefined) =>
  o ? Object.values(o).reduce((a, b) => a + b, 0) : null;

export function buildDashboardModel(summary: SummaryData | null | undefined, go: DashboardNavigate): DashboardModel {
  const rd = summary?.repairdash;
  const dr = summary?.driver;
  const pm = summary?.payments;
  const fb = summary?.feedback;
  const promo = summary?.promociones;

  const txByStatus = pm?.transactionsByStatus || null;
  const txMax = Math.max(1, ...Object.values(txByStatus || {}));
  const txBars = ['PENDING', 'RESERVED', 'LIQUIDATED', 'TRANSFERRED', 'DISPUTED', 'REFUNDED', 'FAILED'].map(status => {
    const count = txByStatus?.[status] ?? 0;
    return { label: STATUS_META[status].label, count, w: Math.round((count / txMax) * 100) };
  });

  const sumWdRequested = pm?.withdrawalsByStatus?.REQUESTED ?? null;
  const commissionRate = pm?.commission?.commissionRate ?? null;
  const commissionUpdated = pm?.commission?.updatedAt ?? '';

  return {
    txBars,
    sumWdRequested,
    commissionRate,
    commissionUpdated,
    appCards: [
      {
        name: 'RepairDash',
        dot: 'var(--pink)',
        stats: [
          { val: n(rd?.clientes), label: 'Clientes' },
          { val: n(rd?.viajes), label: 'Viajes' },
        ],
        links: [
          { label: 'Clientes ->', color: 'var(--pink)', go: () => go('clientes') },
          { label: 'Viajes ->', color: 'var(--pink)', go: () => go('viajes') },
        ],
      },
      {
        name: 'DriverApp',
        dot: 'var(--violet)',
        stats: [
          { val: n(dr?.workers?.total), label: 'Trabajadores' },
          { val: n(dr?.workers?.online), label: 'Online', color: 'var(--ok)' },
          { val: n(dr?.jobs?.activos), label: 'Trabajos activos' },
        ],
        links: [
          { label: 'Trabajadores ->', color: 'var(--violet)', go: () => go('workers') },
          { label: 'Trabajos ->', color: 'var(--violet)', go: () => go('jobs') },
        ],
      },
      {
        name: 'Payments',
        dot: 'var(--mag)',
        stats: [
          { val: n(sumValues(txByStatus)), label: 'Transacciones' },
          { val: n(sumWdRequested), label: 'Retiros pend.', color: 'var(--warn)' },
          { val: commissionRate == null ? '---' : commissionRate + '%', label: 'Comision' },
        ],
        links: [
          { label: 'Transacciones ->', color: 'var(--mag)', go: () => go('transactions') },
          { label: 'Retiros ->', color: 'var(--mag)', go: () => go('withdrawals') },
        ],
      },
      {
        name: 'Feedback',
        dot: 'var(--pink)',
        stats: [
          { val: n(fb?.reportesAbiertos), label: 'Abiertos', color: 'var(--warn)' },
          { val: n(fb?.reportesEnRevision), label: 'En revision', color: 'var(--violet)' },
          { val: n(fb?.reportesResueltos), label: 'Resueltos' },
        ],
        links: [{ label: 'Disputas ->', color: 'var(--pink)', go: () => go('feedback') }],
      },
      {
        name: 'Promociones',
        dot: 'var(--pink)',
        stats: [
          { val: n(promo?.total), label: 'Promociones', color: 'var(--ok)' },
          { val: n(promo?.usos), label: 'Usos' },
        ],
        links: [
          { label: 'Promociones ->', color: 'var(--pink)', go: () => go('promotions') },
          { label: 'Historial ->', color: 'var(--pink)', go: () => go('historial') },
        ],
      },
    ],
  };
}
