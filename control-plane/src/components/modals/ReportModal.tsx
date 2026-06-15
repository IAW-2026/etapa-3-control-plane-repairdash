'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { getBadge, fdate, TONES, STATUS_META } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export function ReportModal() {
  const { state, dispatch, closeModal, saveResolve, fetchReportDetail } = useStore();
  const { modal, data, reportDetail, reportLoading } = state;
  const reportId = modal?.type === 'report' ? modal.id : null;

  // Load the full report (users, trabajo, pruebas) from /api/cp/reports/[id].
  useEffect(() => {
    if (reportId) fetchReportDetail(reportId);
  }, [reportId, fetchReportDetail]);

  if (modal?.type !== 'report') return null;

  // Prefer the freshly fetched detail; fall back to the list row meanwhile.
  const listItem = data.reports.find(r => r.id === modal.id);
  const rep = reportDetail && reportDetail.id === modal.id ? reportDetail : listItem;

  if (!rep) {
    return (
      <div className="modal-overlay-top">
        <div className="modal-box" style={{ width: 'min(560px, 100%)', gap: 16, margin: 'auto' }}>
          <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 17, fontWeight: 700 }}>Reporte {modal.id}</span>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text3)' }}>{reportLoading ? 'Cargando reporte…' : 'No se pudo cargar el reporte.'}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-ghost" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      </div>
    );
  }

  const b = getBadge(rep.estado);
  const resolvable = rep.estado === 'PRUEBAS_AGREGADAS';
  const resolved = rep.estado === 'RESUELTO';
  const fechas = fdate(rep.trabajo.fechaInicio) + (rep.trabajo.fechaFin ? ' → ' + fdate(rep.trabajo.fechaFin) : ' → en curso');
  const rolLabel = (rol: string) => rol === 'rider' ? 'Rider' : 'Driver';

  return (
    <div className="modal-overlay-top">
      <div className="modal-box" style={{ width: 'min(560px, 100%)', gap: 16, margin: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 17, fontWeight: 700 }}>Reporte {rep.id}</span>
            <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>GET /api/control-plane/reports/{rep.id}</span>
          </div>
          <Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} />
        </div>

        <p style={{ margin: 0, fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{rep.descripcion}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Reportante', user: rep.reportante },
            { label: 'Reportado', user: rep.reportado },
          ].map(({ label, user }) => (
            <div key={label} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '13px 14px', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)' }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{user.nombre} {user.apellido}</span>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>{rolLabel(user.rol)}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '13px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)' }}>Trabajo asociado</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{rep.trabajo.id}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{rep.trabajo.tipoDeTrabajo}</span>
            <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>{fechas}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)' }}>Pruebas adjuntas</span>
          {rep.pruebas.length > 0 ? (
            <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
              {rep.pruebas.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 12.5, color: 'var(--text2)' }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: p.tipo === 'video' ? 'var(--violet)' : 'var(--pink)' }} />
                  {p.tipo === 'video' ? 'Video' : 'Imagen'}
                </div>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: 13, color: 'var(--text3)' }}>Sin pruebas adjuntas.</span>
          )}
        </div>

        {resolvable && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Resolver disputa</span>
            <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>PATCH /api/control-plane/reports/{rep.id}/resolve</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {([['AFavor', 'A favor', 'Se desestima el reporte', 'var(--ok)', 'var(--ok-soft)'], ['EnContra', 'En contra', 'Falla contra el reportado', 'var(--danger)', 'var(--danger-soft)']] as const).map(([val, title, sub, fg, bg]) => {
                const active = modal.decision === val;
                return (
                  <div
                    key={val}
                    onClick={() => dispatch({ type: 'SET_MODAL_DECISION', payload: val })}
                    style={{
                      display: 'flex', flexDirection: 'column', gap: 2, padding: '12px 14px',
                      borderRadius: 11, cursor: 'pointer',
                      border: `1px solid ${active ? fg : 'var(--border)'}`,
                      background: active ? bg : 'transparent', transition: 'all .12s',
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 600, color: fg }}>{title}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--text3)' }}>{sub}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {resolved && rep.decision && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--text2)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ok)' }} />
            Disputa resuelta — fallo{' '}
            <strong style={{ color: TONES[STATUS_META[rep.decision].tone][1], margin: '0 3px' }}>
              {STATUS_META[rep.decision].label}
            </strong>{' '}
            del reportado.
          </div>
        )}

        {rep.estado === 'CREADO' && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, fontSize: 12.5, color: 'var(--text3)' }}>
            El reporte aún no tiene pruebas agregadas. Solo puede resolverse cuando pasa al estado <strong>En revisión</strong>.
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={closeModal}>Cerrar</button>
          {resolvable && (
            <button
              className="btn-primary"
              onClick={saveResolve}
              disabled={!modal.decision}
            >
              Confirmar resolución
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
