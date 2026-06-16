'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useSyncRoute } from '@/lib/routes';
import { getBadge, STATUS_META, TONES, fdate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/table/Pagination';
import { SearchParamInput } from '@/components/table/SearchParamInput';
import { paramsHref, setListFilterParam, type ListFilters } from '@/lib/search-params';
import type { Report, SummaryData } from '@/lib/types';

const fmt = (v: number | null | undefined) => (v == null ? '---' : v);

export function FeedbackView({
  filters,
  rows,
  total,
  totalPages,
  summary,
}: {
  filters: ListFilters;
  rows: Report[];
  total: number;
  totalPages: number;
  summary: SummaryData | null;
}) {
  useSyncRoute('feedback');
  const { dispatch } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: 'q' | 'status' | 'resFilter', value: string) => {
    const next = setListFilterParam(new URLSearchParams(searchParams.toString()), key, value);
    router.replace(paramsHref(pathname, next));
  };

  const fb = summary?.feedback;
  const summaryCards = [
    { label: 'Abiertos', value: fmt(fb?.reportesAbiertos), color: 'var(--warn)' },
    { label: 'En revision', value: fmt(fb?.reportesEnRevision), color: 'var(--violet)' },
    { label: 'Resueltos', value: fmt(fb?.reportesResueltos), color: 'var(--ok)' },
    { label: 'Reviews pend.', value: fmt(fb?.reviewsPendientes), color: 'var(--text)' },
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
        <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text2)', maxWidth: '68ch' }}>
          Reportes y disputas entre riders y drivers. Feedback es la fuente de verdad: resolver una disputa aca <strong>no modifica Payments</strong> (no frena, destraba ni reembolsa pagos).
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {summaryCards.map(c => (
          <div key={c.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {summary ? (
              <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 27, fontWeight: 700, color: c.color }}>{c.value}</span>
            ) : (
              <Skeleton w={48} h={27} style={{ margin: '4px 0 3px' }} />
            )}
            <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchParamInput
          key={`${pathname}:${filters.q}`}
          placeholder="Buscar por ID, usuario o trabajo..."
          initialValue={filters.q}
          onApply={value => updateParam('q', value)}
          className="select-base"
          style={{ flex: 1, minWidth: 190, maxWidth: 340, padding: '9px 13px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13.5, outline: 'none', borderRadius: 10 }}
        />
        <select value={filters.status} onChange={e => updateParam('status', e.target.value)} className="select-base">
          <option value="ALL">Todos los estados</option>
          <option value="CREADO">Creado</option>
          <option value="PRUEBAS_AGREGADAS">En revision</option>
          <option value="RESUELTO">Resuelto</option>
        </select>
        <select value={filters.resFilter} onChange={e => updateParam('resFilter', e.target.value)} className="select-base">
          <option value="ALL">Toda resolucion</option>
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
                {['Reporte', 'Reportante -> Reportado', 'Estado', 'Decision', 'Creado', ''].map((h, i) => (
                  <th key={i} className={`th${i === 5 ? ' th-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const b = getBadge(r.estado);
                const resolvable = r.estado === 'PRUEBAS_AGREGADAS';
                const decMeta = r.decision ? STATUS_META[r.decision] : null;
                const decColor = decMeta ? TONES[decMeta.tone][1] : 'var(--text3)';
                return (
                  <tr key={r.id} className="tr-base">
                    <td className="td" style={{ maxWidth: 320 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text3)' }}>{r.id} - {r.trabajo.tipoDeTrabajo}</div>
                      <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.descripcion}</div>
                    </td>
                    <td className="td" style={{ fontSize: 13 }}>
                      <span style={{ fontWeight: 600 }}>{r.reportante.nombre} {r.reportante.apellido}</span>
                      <span style={{ color: 'var(--text3)' }}>{' -> '}</span>
                      <span>{r.reportado.nombre} {r.reportado.apellido}</span>
                    </td>
                    <td className="td"><Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} /></td>
                    <td className="td"><span style={{ fontSize: 12.5, fontWeight: 600, color: decColor }}>{r.decision ? STATUS_META[r.decision].label : '---'}</span></td>
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
        {rows.length === 0 && (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>Sin reportes para los filtros aplicados.</div>
        )}

        <Pagination page={filters.page} totalPages={totalPages} total={total} />
      </div>
    </div>
  );
}
