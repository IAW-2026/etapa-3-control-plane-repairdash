'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { money, fdate, getBadge, STATUS_META, TONES, promoEstado, promoValor } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { AppData, Route } from '@/lib/types';

// Mirrors the server-side page size used by the /api/cp/* routes.
const PAGE_SIZE = 20;

const ROUTE_KEY: Partial<Record<Route, keyof AppData>> = {
  clientes: 'clientes', workers: 'workers', pdrivers: 'pdrivers', priders: 'priders',
  jobs: 'jobs', viajes: 'viajes', services: 'serviceTypes', transactions: 'transactions',
  withdrawals: 'withdrawals', promotions: 'promotions', historial: 'promoHistory',
};

const ROUTE_META: Record<string, {
  group: string; title: string; app?: string; tone?: string; endpoint?: string; sub?: string;
  search?: string; statuses?: string[]; dates?: boolean; create?: boolean; createLabel?: string;
}> = {
  clientes:     { group: 'Usuarios',    title: 'Clientes',           app: 'RepairDash', tone: 'pink',   endpoint: 'GET /api/super-admin/clientes',        sub: 'Clientes registrados en RepairDash (Rider app). Podés editar nombre y apellido o eliminar el registro.', search: 'Buscar por nombre, email o Clerk ID…' },
  workers:      { group: 'Usuarios',    title: 'Trabajadores',       app: 'DriverApp',  tone: 'violet', endpoint: 'GET /api/control-plane/workers',        sub: 'Trabajadores de DriverApp. Desde acá podés activar o desactivar su estado operativo.', search: 'Buscar por nombre, email o Clerk ID…', statuses: ['ONLINE','OFFLINE','EN_TRABAJO'] },
  pdrivers:     { group: 'Usuarios',    title: 'Drivers (billeteras)',app: 'Payments',  tone: 'mag',    endpoint: 'GET /api/control-plane/drivers',        sub: 'Estado financiero de los drivers en Payments: balances disponibles y bloqueados. Solo lectura.', search: 'Buscar por nombre, email o CBU/CVU…' },
  priders:      { group: 'Usuarios',    title: 'Riders (pagos)',      app: 'Payments',  tone: 'mag',    endpoint: 'GET /api/control-plane/riders',         sub: 'Riders con actividad de pago en Payments. Solo lectura.', search: 'Buscar por nombre, email o Clerk ID…' },
  jobs:         { group: 'Operaciones', title: 'Trabajos',           app: 'DriverApp',  tone: 'violet', endpoint: 'GET /api/control-plane/jobs',           sub: 'Trabajos solicitados en DriverApp con su rider, driver asignado y estado del flujo.', search: 'Buscar por ID, rider o dirección…', statuses: ['PENDIENTE','ACEPTADO','RECHAZADO','EN_CAMINO','EN_SERVICIO','FINALIZADO','CANCELADO'] },
  viajes:       { group: 'Operaciones', title: 'Viajes',             app: 'RepairDash', tone: 'pink',   endpoint: 'GET /api/super-admin/viajes',          sub: 'Viajes del sistema según RepairDash, con el cliente asociado y sus pagos.', search: 'Buscar por cliente, driver o tipo…', statuses: ['pendiente','en curso','concluido','cancelado'] },
  services:     { group: 'Operaciones', title: 'Tipos de servicio',  app: 'DriverApp',  tone: 'violet', endpoint: 'GET /api/control-plane/service-types', sub: 'Catálogo comercial de DriverApp. Podés crear, editar y dar de baja tipos de servicio.', search: 'Buscar por nombre o descripción…', create: true, createLabel: '+ Nuevo tipo de servicio' },
  transactions: { group: 'Finanzas',   title: 'Transacciones',      app: 'Payments',   tone: 'mag',    endpoint: 'GET /api/control-plane/transactions',  sub: 'Transacciones de Payments con rider y driver asociados. Solo lectura en v1.', search: 'Buscar por ID, trabajo, rider o driver…', statuses: ['PENDING','RESERVED','LIQUIDATED','TRANSFERRED','DISPUTED','REFUNDED','FAILED'], dates: true },
  withdrawals:  { group: 'Finanzas',   title: 'Retiros',            app: 'Payments',   tone: 'mag',    endpoint: 'GET /api/control-plane/withdrawals',   sub: 'Solicitudes de retiro de los drivers. La aprobación queda en el admin de Payments.', search: 'Buscar por ID, driver o email…', statuses: ['REQUESTED','APPROVED','REJECTED'], dates: true },
  promotions:   { group: 'Plataforma', title: 'Promociones',        app: 'Promociones', tone: 'pink',  endpoint: 'GET /api/admin/promociones',           sub: 'Catálogo global de promociones. Como SuperAdmin podés crear, editar y dar de baja (soft delete) cualquier promoción del sistema.', search: 'Buscar por nombre, descripción o categoría…', statuses: ['activa','vencida','programada','eliminada'], create: true, createLabel: '+ Nueva promoción' },
  historial:    { group: 'Plataforma', title: 'Historial de promos', app: 'Promociones', tone: 'pink', endpoint: 'GET /api/historial',                   sub: 'Registro de usos de promociones por los riders, con el trabajo asociado y el ahorro aplicado. Solo lectura.', search: 'Buscar por promoción, usuario o trabajo…', dates: true },
};

const TONE_COLORS: Record<string, [string, string]> = {
  pink:   ['var(--pink-soft)',   'var(--pink)'],
  violet: ['var(--violet-soft)', 'var(--violet)'],
  mag:    ['var(--mag-soft)',    'var(--mag)'],
};

export function TableView({ route }: { route: Route }) {
  const { state, dispatch, fetchRouteData, deleteCliente, deleteService, deletePromo } = useStore();
  const { data, q, status, resFilter, dateFrom, dateTo, page, loading, serverTotal, totalPages: serverTotalPages } = state;
  const meta = ROUTE_META[route];
  const tone = TONE_COLORS[meta.tone || 'mut'] || ['var(--mut-soft)', 'var(--mut)'];

  // Load the current page from the real upstream API whenever the route or
  // any filter/pagination input changes. Text search is debounced.
  useEffect(() => {
    const t = setTimeout(() => {
      fetchRouteData(route, { q, status, resFilter, dateFrom, dateTo, page });
    }, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [route, q, status, resFilter, dateFrom, dateTo, page, fetchRouteData]);

  // Open create modal
  const openCreate = () => {
    if (route === 'promotions') {
      dispatch({ type: 'SET_MODAL', payload: { type: 'promo', id: null } });
      dispatch({ type: 'SET_FORM', payload: { nombre: '', descripcion: '', tipoDescuento: 'porcentaje', valor: '', categorias: [], precioMinimo: '', destacada: false, usoUnico: false, fechaInicio: '', fechaFin: '' } });
    } else {
      dispatch({ type: 'SET_MODAL', payload: { type: 'service', id: null } });
      dispatch({ type: 'SET_FORM', payload: { nombre: '', descripcion: '', precio: '' } });
    }
  };

  // Data is already filtered + paginated server-side by the /api/cp/* route.
  type AnyItem = Record<string, unknown>;
  const dataKey = ROUTE_KEY[route];
  const sliced = (dataKey ? data[dataKey] : []) as unknown as AnyItem[];

  const total = serverTotal;
  const totalPages = Math.max(1, serverTotalPages);
  const currentPage = Math.min(page, totalPages);

  const statusOptions = [{ value: 'ALL', label: 'Todos los estados' }, ...(meta.statuses || []).map(st => ({ value: st, label: (STATUS_META[st] || { label: st }).label }))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1280, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'var(--font-grotesk)', fontSize: 'clamp(21px, 3vw, 25px)', fontWeight: 700, margin: 0, letterSpacing: '-.015em' }}>{meta.title}</h1>
            {meta.app && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: tone[0], color: tone[1] }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: tone[1] }} />{meta.app}
              </span>
            )}
          </div>
          {meta.endpoint && <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{meta.endpoint}</span>}
          {meta.sub && <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text2)', maxWidth: '68ch' }}>{meta.sub}</p>}
        </div>
        {meta.create && (
          <button className="btn-primary" onClick={openCreate}>{meta.createLabel || '+ Nuevo'}</button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', margin: '18px 0 14px' }}>
        <input
          placeholder={meta.search || 'Buscar…'}
          value={q}
          onChange={e => dispatch({ type: 'SET_Q', payload: e.target.value })}
          style={{ flex: 1, minWidth: 190, maxWidth: 340, padding: '9px 13px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13.5, outline: 'none' }}
        />
        {meta.statuses && (
          <select value={status} onChange={e => dispatch({ type: 'SET_STATUS', payload: e.target.value })} className="select-base">
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )}
        {meta.dates && (
          <>
            <input type="date" value={dateFrom} onChange={e => dispatch({ type: 'SET_DATE_FROM', payload: e.target.value })} className="input-sm" />
            <input type="date" value={dateTo} onChange={e => dispatch({ type: 'SET_DATE_TO', payload: e.target.value })} className="input-sm" />
          </>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--text3)' }}>{total} {total === 1 ? 'resultado' : 'resultados'}</span>
      </div>

      {/* Table container */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {route === 'clientes' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead><tr>
                {['Cliente','Clerk ID','Calificación','Viajes',''].map((h, i) => <th key={i} className={`th${i === 4 ? ' th-right' : ''}`}>{h}</th>)}
              </tr></thead>
              <tbody>
                {sliced.map(r => {
                  const c = (r as unknown) as typeof data.clientes[0];
                  const viajesCount = data.viajes.filter(v => v.id_clerk === c.id_clerk).length;
                  return (
                    <tr key={c.id_clerk} className="tr-base">
                      <td className="td"><div style={{ fontSize: 14, fontWeight: 600 }}>{c.nombre} {c.apellido}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{c.mail}</div></td>
                      <td className="td" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{c.id_clerk}</td>
                      <td className="td" style={{ fontSize: 13.5, color: 'var(--warn)', fontWeight: 600 }}>{c.calificacion == null ? '—' : '★ ' + c.calificacion.toFixed(1)}</td>
                      <td className="td" style={{ fontSize: 13.5 }}>{viajesCount}</td>
                      <td className="td" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button className="btn-table" style={{ marginRight: 6 }} onClick={() => { dispatch({ type: 'SET_MODAL', payload: { type: 'cliente', id: c.id_clerk, name: c.nombre + ' ' + c.apellido } }); dispatch({ type: 'SET_FORM', payload: { nombre: c.nombre, apellido: c.apellido } }); }}>Editar</button>
                        <button className="btn-table btn-table-danger" onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'confirm', title: 'Eliminar cliente', desc: `Se elimina el registro de ${c.nombre} ${c.apellido} en la base de RepairDash. No elimina al usuario en Clerk.`, endpoint: 'DELETE /api/super-admin/clientes/' + c.id_clerk, fn: () => deleteCliente(c.id_clerk) } })}>Eliminar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {route === 'workers' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 840 }}>
              <thead><tr>
                {['Trabajador','Servicios','Estado','Onboarding','Alta',''].map((h, i) => <th key={i} className={`th${i === 5 ? ' th-right' : ''}`}>{h}</th>)}
              </tr></thead>
              <tbody>
                {sliced.map(r => {
                  const w = (r as unknown) as typeof data.workers[0];
                  const b = getBadge(w.status);
                  return (
                    <tr key={w.id} className="tr-base">
                      <td className="td"><div style={{ fontSize: 14, fontWeight: 600 }}>{w.nombre}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{w.email}</div></td>
                      <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{w.servicios}</td>
                      <td className="td"><Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} /></td>
                      <td className="td" style={{ fontSize: 13, color: w.onboarding ? 'var(--ok)' : 'var(--warn)' }}>{w.onboarding ? 'Completo' : 'Pendiente'}</td>
                      <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(w.creadoEn)}</td>
                      <td className="td" style={{ textAlign: 'right' }}>
                        <button className="btn-table" onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'worker', id: w.id, name: w.nombre, status: w.status } })}>Cambiar estado</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {route === 'pdrivers' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 880 }}>
              <thead><tr>
                {['Driver','CBU / CVU','Disponible','Bloqueado','Actividad','Última act.'].map((h, i) => <th key={i} className={`th${i === 2 || i === 3 ? ' th-right' : ''}`}>{h}</th>)}
              </tr></thead>
              <tbody>
                {sliced.map(r => {
                  const x = (r as unknown) as typeof data.pdrivers[0];
                  return (
                    <tr key={x.clerkId} className="tr-base">
                      <td className="td"><div style={{ fontSize: 14, fontWeight: 600 }}>{x.name}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{x.email}</div></td>
                      <td className="td" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{x.cbu.slice(0, 14)}…</td>
                      <td className="td" style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600, color: 'var(--ok)' }}>{money(x.avail)}</td>
                      <td className="td" style={{ textAlign: 'right', fontSize: 13.5, color: 'var(--text2)' }}>{money(x.locked)}</td>
                      <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{x.txs} txs · {x.wds} retiros</td>
                      <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(x.last)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {route === 'priders' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 780 }}>
              <thead><tr>
                {['Rider','Clerk ID','Transacciones','Volumen pagado','Última transacción'].map((h, i) => <th key={i} className={`th${i === 2 || i === 3 ? ' th-right' : ''}`}>{h}</th>)}
              </tr></thead>
              <tbody>
                {sliced.map(r => {
                  const x = (r as unknown) as typeof data.priders[0];
                  return (
                    <tr key={x.clerkId} className="tr-base">
                      <td className="td"><div style={{ fontSize: 14, fontWeight: 600 }}>{x.name}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{x.email}</div></td>
                      <td className="td" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{x.clerkId}</td>
                      <td className="td" style={{ textAlign: 'right', fontSize: 13.5 }}>{x.txs}</td>
                      <td className="td" style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600 }}>{money(x.volume)}</td>
                      <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(x.last)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {route === 'jobs' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
              <thead><tr>
                {['Trabajo','Rider','Driver','Dirección','Monto est.','Estado','Creado'].map((h, i) => <th key={i} className={`th${i === 4 ? ' th-right' : ''}`}>{h}</th>)}
              </tr></thead>
              <tbody>
                {sliced.map(r => {
                  const j = (r as unknown) as typeof data.jobs[0];
                  const b = getBadge(j.estado);
                  return (
                    <tr key={j.id} className="tr-base">
                      <td className="td"><div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{j.id}</div><div style={{ fontSize: 13, fontWeight: 600 }}>{j.servicio}</div></td>
                      <td className="td" style={{ fontSize: 13.5 }}>{j.rider}</td>
                      <td className="td" style={{ fontSize: 13.5, color: j.driver ? 'var(--text)' : 'var(--text3)' }}>{j.driver || 'Sin asignar'}</td>
                      <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{j.direccion}</td>
                      <td className="td" style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600 }}>{money(j.monto)}</td>
                      <td className="td"><Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} /></td>
                      <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(j.creadoEn)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {route === 'viajes' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 920 }}>
              <thead><tr>
                {['#','Cliente','Tipo de trabajo','Driver','Pago','Estado','Fecha'].map((h, i) => <th key={i} className="th">{h}</th>)}
              </tr></thead>
              <tbody>
                {sliced.map(r => {
                  const v = (r as unknown) as typeof data.viajes[0];
                  const b = getBadge(v.estado);
                  const pagoMeta = STATUS_META[v.pago.estado] || { label: v.pago.estado, tone: 'mut' as const };
                  return (
                    <tr key={v.id_viaje} className="tr-base">
                      <td className="td" style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--text2)' }}>#{v.id_viaje}</td>
                      <td className="td" style={{ fontSize: 13.5, fontWeight: 600 }}>{v.cliente}</td>
                      <td className="td" style={{ fontSize: 13.5, color: 'var(--text2)' }}>{v.tipo}</td>
                      <td className="td" style={{ fontSize: 13.5, color: 'var(--text2)' }}>{v.driver}</td>
                      <td className="td">
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{money(v.pago.monto)}</div>
                        <div style={{ fontSize: 11.5, color: TONES[pagoMeta.tone][1] }}>{pagoMeta.label}</div>
                      </td>
                      <td className="td"><Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} /></td>
                      <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(v.fecha)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {route === 'services' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
              <thead><tr>
                {['Servicio','Precio base','Drivers','Trabajos activos',''].map((h, i) => <th key={i} className={`th${i === 1 || i === 2 || i === 3 || i === 4 ? ' th-right' : ''}`}>{h}</th>)}
              </tr></thead>
              <tbody>
                {sliced.map(r => {
                  const t = (r as unknown) as typeof data.serviceTypes[0];
                  return (
                    <tr key={t.id} className="tr-base">
                      <td className="td"><div style={{ fontSize: 14, fontWeight: 600 }}>{t.nombre}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{t.descripcion}</div></td>
                      <td className="td" style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600 }}>{money(t.precioBase)}</td>
                      <td className="td" style={{ textAlign: 'right', fontSize: 13.5 }}>{t.drivers}</td>
                      <td className="td" style={{ textAlign: 'right', fontSize: 13.5 }}>{t.activos}</td>
                      <td className="td" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button className="btn-table" style={{ marginRight: 6 }} onClick={() => { dispatch({ type: 'SET_MODAL', payload: { type: 'service', id: t.id } }); dispatch({ type: 'SET_FORM', payload: { nombre: t.nombre, descripcion: t.descripcion, precio: t.precioBase } }); }}>Editar</button>
                        <button className="btn-table btn-table-danger" onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'confirm', title: 'Eliminar tipo de servicio', desc: `Se elimina "${t.nombre}" del catálogo de DriverApp. Si tiene relaciones activas, la API devuelve error y no fuerza el borrado.`, endpoint: 'DELETE /api/control-plane/service-types/' + t.id, fn: () => deleteService(t.id) } })}>Eliminar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {route === 'transactions' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 940 }}>
              <thead><tr>
                {['Transacción','Rider → Driver','Monto','Comisión','Estado','Fecha'].map((h, i) => <th key={i} className={`th${i === 2 || i === 3 ? ' th-right' : ''}`}>{h}</th>)}
              </tr></thead>
              <tbody>
                {sliced.map(r => {
                  const t = (r as unknown) as typeof data.transactions[0];
                  const b = getBadge(t.status);
                  return (
                    <tr key={t.id} className="tr-base">
                      <td className="td"><div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>{t.id}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>{t.trabajo}</div></td>
                      <td className="td" style={{ fontSize: 13.5 }}>{t.rider} → {t.driver}</td>
                      <td className="td" style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600 }}>{money(t.amount)}</td>
                      <td className="td" style={{ textAlign: 'right', fontSize: 13, color: 'var(--text2)' }}>{t.comision ? money(t.comision) : '—'}</td>
                      <td className="td"><Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} /></td>
                      <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(t.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {route === 'withdrawals' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
              <thead><tr>
                {['Retiro','Driver','Monto','Estado','Solicitado'].map((h, i) => <th key={i} className={`th${i === 2 ? ' th-right' : ''}`}>{h}</th>)}
              </tr></thead>
              <tbody>
                {sliced.map(r => {
                  const w = (r as unknown) as typeof data.withdrawals[0];
                  const b = getBadge(w.status);
                  return (
                    <tr key={w.id} className="tr-base">
                      <td className="td" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{w.id}</td>
                      <td className="td"><div style={{ fontSize: 14, fontWeight: 600 }}>{w.driver}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>{w.cbu.slice(0, 14)}…</div></td>
                      <td className="td" style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600 }}>{money(w.amount)}</td>
                      <td className="td"><Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} /></td>
                      <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(w.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {route === 'promotions' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
              <thead><tr>
                {['Promoción','Descuento','Categorías','Vigencia','Estado',''].map((h, i) => <th key={i} className={`th${i === 5 ? ' th-right' : ''}`}>{h}</th>)}
              </tr></thead>
              <tbody>
                {sliced.map(r => {
                  const p = (r as unknown) as typeof data.promotions[0];
                  const est = promoEstado(p);
                  const b = getBadge(est);
                  const disabled = p.eliminada;
                  return (
                    <tr key={p.id} className="tr-base">
                      <td className="td" style={{ maxWidth: 300 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          {p.destacada && <span style={{ color: 'var(--warn)', fontSize: 13 }}>★</span>}
                          <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nombre}</span>
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.descripcion}</div>
                      </td>
                      <td className="td">
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pink)' }}>{promoValor(p)}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text3)' }}>{p.tipoDescuento === 'porcentaje' ? 'Porcentaje' : 'Monto fijo'}{p.precioMinimo ? ' · mín ' + money(p.precioMinimo) : ''}</div>
                      </td>
                      <td className="td" style={{ fontSize: 12.5, color: 'var(--text2)' }}>{p.categorias.length ? p.categorias.join(', ') : 'Todas'}</td>
                      <td className="td" style={{ fontSize: 12.5, color: 'var(--text2)' }}>{fdate(p.fechaInicio)} → {p.fechaFin ? fdate(p.fechaFin) : 'sin venc.'}</td>
                      <td className="td">
                        <Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} />
                        {p.usoUnico && <span style={{ display: 'block', marginTop: 4, fontSize: 10.5, color: 'var(--text3)' }}>Uso único</span>}
                      </td>
                      <td className="td" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button className="btn-table" style={{ marginRight: 6, opacity: disabled ? .4 : 1, pointerEvents: disabled ? 'none' : 'auto' }} onClick={() => { dispatch({ type: 'SET_MODAL', payload: { type: 'promo', id: p.id } }); dispatch({ type: 'SET_FORM', payload: { nombre: p.nombre, descripcion: p.descripcion, tipoDescuento: p.tipoDescuento, valor: p.valor, categorias: [...p.categorias], precioMinimo: p.precioMinimo == null ? '' : p.precioMinimo, destacada: p.destacada, usoUnico: p.usoUnico, fechaInicio: p.fechaInicio.slice(0, 10), fechaFin: p.fechaFin ? p.fechaFin.slice(0, 10) : '' } }); }}>Editar</button>
                        <button className="btn-table btn-table-danger" style={{ opacity: disabled ? .4 : 1, pointerEvents: disabled ? 'none' : 'auto' }} onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'confirm', title: 'Eliminar promoción', desc: `Soft delete de "${p.nombre}": se marca como eliminada y deja de verse para los usuarios al instante. Queda consultable con ?eliminada=true.`, endpoint: 'DELETE /api/admin/promociones/' + p.id, fn: () => deletePromo(p.id) } })}>Eliminar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {route === 'historial' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 920 }}>
              <thead><tr>
                {['Promoción','Usuario','Trabajo','Original → Pagado','Ahorro','Fecha'].map((h, i) => <th key={i} className={`th${i === 3 || i === 4 ? ' th-right' : ''}`}>{h}</th>)}
              </tr></thead>
              <tbody>
                {sliced.map(r => {
                  const h = (r as unknown) as typeof data.promoHistory[0];
                  const promo = data.promotions.find(p => p.id === h.promocionId);
                  return (
                    <tr key={h.id} className="tr-base">
                      <td className="td">
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{h.nombre}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text3)' }}>{promo ? (promo.tipoDescuento === 'porcentaje' ? promo.valor + '% de descuento' : 'Monto fijo') : '—'}</div>
                      </td>
                      <td className="td" style={{ fontSize: 13.5 }}>{h.usuario}</td>
                      <td className="td" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>trabajo #{h.trabajoId}</td>
                      <td className="td" style={{ textAlign: 'right', fontSize: 13 }}>
                        <span style={{ color: 'var(--text3)', textDecoration: 'line-through' }}>{money(h.valorOriginal)}</span>{' '}
                        <span style={{ fontWeight: 600 }}>{money(h.valorPagado)}</span>
                      </td>
                      <td className="td" style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600, color: 'var(--ok)' }}>{money(h.valorOriginal - h.valorPagado)}</td>
                      <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(h.fechaUso)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {loading && sliced.length === 0 && (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>Cargando…</div>
        )}
        {!loading && sliced.length === 0 && (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>Sin resultados para los filtros aplicados.</div>
        )}

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '11px 16px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>
            {total === 0 ? '0 de 0' : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, total)} de ${total}`}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn-table" style={{ opacity: currentPage <= 1 ? .4 : 1, pointerEvents: currentPage <= 1 ? 'none' : 'auto' }} onClick={() => dispatch({ type: 'SET_PAGE', payload: Math.max(1, currentPage - 1) })}>Anterior</button>
            <span style={{ fontSize: 12.5, color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>{currentPage} / {totalPages}</span>
            <button className="btn-table" style={{ opacity: currentPage >= totalPages ? .4 : 1, pointerEvents: currentPage >= totalPages ? 'none' : 'auto' }} onClick={() => dispatch({ type: 'SET_PAGE', payload: Math.min(totalPages, currentPage + 1) })}>Siguiente</button>
          </div>
        </div>
      </div>

      {route === 'withdrawals' && (
        <div style={{ marginTop: 14, padding: '13px 16px', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--surface)', fontSize: 13, color: 'var(--text2)' }}>
          Los retiros son <strong>solo lectura</strong> desde Control Plane. La aprobación o rechazo se gestiona en el panel de administración de Payments.
        </div>
      )}
    </div>
  );
}
