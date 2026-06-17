'use client';
import { useEffect } from 'react';
import { ModalShell } from '@/components/common/ModalShell';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useStore } from '@/lib/store';
import { getBadge, STATUS_META, TONES } from '@/lib/utils';
import { ReportEvidenceList } from './components/report-modal/ReportEvidenceList';
import { ReportJobCard } from './components/report-modal/ReportJobCard';
import { ReportLoadingState } from './components/report-modal/ReportLoadingState';
import { ReportPeopleCards } from './components/report-modal/ReportPeopleCards';
import { ResolveDecisionPanel } from './components/report-modal/ResolveDecisionPanel';

export function ReportModal() {
  const { state, dispatch, closeModal, saveResolve, fetchReportDetail } = useStore();
  const { modal, data, reportDetail, reportLoading } = state;
  const reportId = modal?.type === 'report' ? modal.id : null;

  useEffect(() => {
    if (reportId) fetchReportDetail(reportId);
  }, [reportId, fetchReportDetail]);

  if (modal?.type !== 'report') return null;

  const listItem = data.reports.find(r => r.id === modal.id);
  const rep = reportDetail && reportDetail.id === modal.id ? reportDetail : listItem;

  if (reportLoading || !rep) {
    return <ReportLoadingState id={modal.id} loading={reportLoading} onClose={closeModal} />;
  }

  const badge = getBadge(rep.estado);
  const resolvable = rep.estado === 'PRUEBAS_AGREGADAS';
  const resolved = rep.estado === 'RESUELTO';

  return (
    <ModalShell width="min(560px, 100%)" top style={{ gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 17, fontWeight: 700 }}>Reporte {rep.id}</span>
        </div>
        <Badge label={badge.badgeLabel} bg={badge.badgeBg} fg={badge.badgeFg} />
      </div>

      <p style={{ margin: 0, fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{rep.descripcion}</p>
      <ReportPeopleCards reportante={rep.reportante} reportado={rep.reportado} />
      <ReportJobCard trabajo={rep.trabajo} />
      <ReportEvidenceList pruebas={rep.pruebas} />

      {resolvable && (
        <ResolveDecisionPanel
          decision={modal.decision}
          onDecision={decision => dispatch({ type: 'SET_MODAL_DECISION', payload: decision })}
        />
      )}

      {resolved && rep.decision && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--text2)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ok)' }} />
          Disputa resuelta - fallo{' '}
          <strong style={{ color: TONES[STATUS_META[rep.decision].tone][1], margin: '0 3px' }}>
            {STATUS_META[rep.decision].label}
          </strong>{' '}
          del reportado.
        </div>
      )}

      {rep.estado === 'CREADO' && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, fontSize: 12.5, color: 'var(--text3)' }}>
          El reporte aun no tiene pruebas agregadas. Solo puede resolverse cuando pasa al estado <strong>En revision</strong>.
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn-ghost" onClick={closeModal} disabled={state.saving}>Cerrar</button>
        {resolvable && (
          <button className="btn-primary" onClick={saveResolve} disabled={!modal.decision || state.saving}>
            {state.saving ? <Spinner /> : 'Confirmar resolucion'}
          </button>
        )}
      </div>
    </ModalShell>
  );
}
