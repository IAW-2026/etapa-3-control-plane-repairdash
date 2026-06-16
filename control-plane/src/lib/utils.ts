export const money = (v: string | number): string => {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return '$ ' + n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const fdate = (iso: string | null | undefined): string => {
  if (!iso || iso === '—') return '—';
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
};

export type Tone = 'ok' | 'warn' | 'danger' | 'violet' | 'pink' | 'mag' | 'mut';

export const TONES: Record<Tone, [string, string]> = {
  ok:     ['var(--ok-soft)',     'var(--ok)'],
  warn:   ['var(--warn-soft)',   'var(--warn)'],
  danger: ['var(--danger-soft)', 'var(--danger)'],
  violet: ['var(--violet-soft)', 'var(--violet)'],
  pink:   ['var(--pink-soft)',   'var(--pink)'],
  mag:    ['var(--mag-soft)',    'var(--mag)'],
  mut:    ['var(--mut-soft)',    'var(--mut)'],
};

export const STATUS_META: Record<string, { label: string; tone: Tone }> = {
  ONLINE:           { label: 'Online',        tone: 'ok' },
  OFFLINE:          { label: 'Offline',       tone: 'mut' },
  EN_TRABAJO:       { label: 'En trabajo',    tone: 'violet' },
  PENDIENTE:        { label: 'Pendiente',     tone: 'warn' },
  ACEPTADO:         { label: 'Aceptado',      tone: 'violet' },
  RECHAZADO:        { label: 'Rechazado',     tone: 'danger' },
  EN_CAMINO:        { label: 'En camino',     tone: 'pink' },
  EN_SERVICIO:      { label: 'En servicio',   tone: 'violet' },
  FINALIZADO:       { label: 'Finalizado',    tone: 'ok' },
  CANCELADO:        { label: 'Cancelado',     tone: 'mut' },
  PENDING:          { label: 'Pendiente',     tone: 'warn' },
  RESERVED:         { label: 'Reservada',     tone: 'violet' },
  LIQUIDATED:       { label: 'Liquidada',     tone: 'ok' },
  TRANSFERRED:      { label: 'Transferida',   tone: 'pink' },
  DISPUTED:         { label: 'En disputa',    tone: 'danger' },
  REFUNDED:         { label: 'Reembolsada',   tone: 'mut' },
  FAILED:           { label: 'Fallida',       tone: 'danger' },
  REQUESTED:        { label: 'Solicitado',    tone: 'warn' },
  APPROVED:         { label: 'Aprobado',      tone: 'ok' },
  REJECTED:         { label: 'Rechazado',     tone: 'danger' },
  CREADO:           { label: 'Creado',        tone: 'warn' },
  PRUEBAS_AGREGADAS:{ label: 'En revisión',   tone: 'violet' },
  RESUELTO:         { label: 'Resuelto',      tone: 'ok' },
  SinResolver:      { label: 'Sin resolver',  tone: 'warn' },
  Resuelto:         { label: 'Resuelto',      tone: 'ok' },
  AFavor:           { label: 'A favor',       tone: 'ok' },
  EnContra:         { label: 'En contra',     tone: 'danger' },
  activa:           { label: 'Activa',        tone: 'ok' },
  vencida:          { label: 'Vencida',       tone: 'mut' },
  programada:       { label: 'Programada',    tone: 'violet' },
  eliminada:        { label: 'Eliminada',     tone: 'danger' },
  pendiente:        { label: 'Pendiente',     tone: 'warn' },
  'en curso':       { label: 'En curso',      tone: 'violet' },
  concluido:        { label: 'Concluido',     tone: 'ok' },
  cancelado:        { label: 'Cancelado',     tone: 'mut' },
  aceptado:         { label: 'Pago aceptado', tone: 'ok' },
  rechazado:        { label: 'Pago rechazado',tone: 'danger' },
};

export const getBadge = (st: string) => {
  const m = STATUS_META[st] || { label: st, tone: 'mut' as Tone };
  const t = TONES[m.tone];
  return { badgeLabel: m.label, badgeBg: t[0], badgeFg: t[1] };
};

export const promoEstado = (p: { eliminada: boolean; fechaInicio: string; fechaFin: string | null }): string => {
  const now = Date.now();
  if (p.eliminada) return 'eliminada';
  if (new Date(p.fechaInicio).getTime() > now) return 'programada';
  if (p.fechaFin && new Date(p.fechaFin).getTime() < now) return 'vencida';
  return 'activa';
};

export const promoValor = (p: { tipoDescuento: string; valor: number }): string => {
  return p.tipoDescuento === '%'
    ? p.valor + '%'
    : '$ ' + p.valor.toLocaleString('es-AR');
};
