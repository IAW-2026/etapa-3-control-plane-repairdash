'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { getBadge, STATUS_META, TONES, fdate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

const PAGE_SIZE = 20;
const fmt = (v: number | null | undefined) => (v == null ? '—' : v);

export function FeedbackView() {
  const { state, dispatch, fetchRouteData, fetchSummary } = useStore();
  const { data, q, status, resFilter, page, loading, serverTotal, totalPages: serverTotalPages, summary } = state;

  // Reports come filtered + paginated from /api/cp/reports; the cards come
  // from the consolidated /api/cp/summary (Feedback counters).
  useEffect(() => { fetchSummary(); }, [fetchSummary]);
  useEffect(() => {
    const t = setTimeout(() => {
      fetchRouteData('feedback', { q, status, resFilter, dateFrom: '', dateTo: '', page });
    }, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [q, status, resFilter, page, fetchRouteData]);

  const filtered = data.reports;
  const total = serverTotal;
  const totalPages = Math.max(1, serverTotalPages);
  const currentPage = Math.min(page, totalPages);

  const fb = summary?.feedback;
  const summaryCards = [
    { label: 'Abiertos',      value: fmt(fb?.reportesAbiertos),   color: 'var(--warn)' },
    { label: 'En revisión',   value: fmt(fb?.reportesEnRevision), color: 'var(--violet)' },
    { label: 'Resueltos',     value: fmt(fb?.reportesResueltos),  color: 'var(--ok)' },
    { label: 'Reviews pend.', value: fmt(fb?.reviewsPendientes),  color: 'var(--text)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: 'var(--font-grotesk)', fontSize: 'clamp(21px, 3vw, 25px)', fontWeight: 700, margin: 0, letterSpacing: '-.015em' }}>Feedback y disputas</h1>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: 'var(--pink-soft)', color: 'var(--pink)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--pink)' }} />Feedback
          </span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>GET /api/control-plane/reports</span>
        <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text2)', maxWidth: '68ch' }}>
          Reportes y disputas entre riders y drivers. Feedback es la fuente de verdad: resolver una disputa acá <strong>no modifica Payments</strong> (no frena, destraba ni reembolsa pagos).
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {summaryCards.map(c => (
          <div key={c.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 27, fontWeight: 700, color: c.color }}>{c.value}</span>
            <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Buscar por ID, usuario o trabajo…"
          value={q}
          onChange={e => dispatch({ type: 'SET_Q', payload: e.target.value })}
          className="select-base"
          style={{ flex: 1, minWidth: 190, maxWidth: 340, padding: '9px 13px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13.5, outline: 'none', borderRadius: 10 }}
        />
        <select value={status} onChange={e => dispatch({ type: 'SET_STATUS', payload: e.target.value })} className="select-base">
          <option value="ALL">Todos los estados</option>
          <option value="CREADO">Creado</option>
          <option value="PRUEBAS_AGREGADAS">En revisión</option>
          <option value="RESUELTO">Resuelto</option>
        </select>
        <select value={resFilter} onChange={e => dispatch({ type: 'SET_RES_FILTER', payload: e.target.value })} className="select-base">
          <option value="ALL">Toda resolución</option>
          <option value="SinResolver">Sin resolver</option>
          <option value="Resuelto">Resuelto</option>
        </select>
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--text3)' }}>
          {total} {total === 1 ? 'reporte' : 'reportes'}
        </span>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
            <thead>
              <tr>
                {['Reporte', 'Reportante → Reportado', 'Estado', 'Decisión', 'Creado', ''].map((h, i) => (
                  <th key={i} className={`th${i === 5 ? ' th-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const b = getBadge(r.estado);
                const resolvable = r.estado === 'PRUEBAS_AGREGADAS';
                const decMeta = r.decision ? STATUS_META[r.decision] : null;
                const decColor = decMeta ? TONES[decMeta.tone][1] : 'var(--text3)';
                return (
                  <tr key={r.id} className="tr-base">
                    <td className="td" style={{ maxWidth: 320 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text3)' }}>{r.id} · {r.trabajo.tipoDeTrabajo}</div>
                      <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.descripcion}</div>
                    </td>
                    <td className="td" style={{ fontSize: 13 }}>
                      <span style={{ fontWeight: 600 }}>{r.reportante.nombre} {r.reportante.apellido}</span>
                      <span style={{ color: 'var(--text3)' }}> → </span>
                      <span>{r.reportado.nombre} {r.reportado.apellido}</span>
                    </td>
                    <td className="td"><Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} /></td>
                    <td className="td"><span style={{ fontSize: 12.5, fontWeight: 600, color: decColor }}>{r.decision ? STATUS_META[r.decision].label : '—'}</span></td>
                    <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(r.creadoEn)}</td>
                    <td className="td" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        className="btn-table"
                        style={resolvable ? { borderColor: 'var(--violet)', color: 'var(--violet)' } : {}}
                        onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'report', id: r.id, decision: null } })}
                      >
                        {resolvable ? 'Resolver' : 'Ver'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {loading && filtered.length === 0 && (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>Cargando…</div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>Sin reportes para los filtros aplicados.</div>
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
    </div>
  );
}
