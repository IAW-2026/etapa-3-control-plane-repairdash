'use client';
import { ModalShell } from '@/components/common/ModalShell';
import { Spinner } from '@/components/ui/Spinner';
import { useStore } from '@/lib/store';
import { STATUS_META, TONES } from '@/lib/utils';

const WORKER_STATUSES = ['ONLINE', 'OFFLINE', 'EN_TRABAJO'] as const;

export function WorkerModal() {
  const { state, dispatch, closeModal, saveWorker } = useStore();
  const { modal } = state;
  if (modal?.type !== 'worker') return null;

  return (
    <ModalShell width="min(440px, 100%)" label={`Cambiar estado de ${modal.name}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 17, fontWeight: 700 }}>Cambiar estado - {modal.name}</span>
      </div>
      <div role="radiogroup" aria-label="Estado del trabajador" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {WORKER_STATUSES.map(status => {
          const meta = STATUS_META[status];
          const tone = TONES[meta.tone];
          const active = modal.status === status;
          return (
            <button
              key={status}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => dispatch({ type: 'SET_MODAL_WORKER_STATUS', payload: status })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                textAlign: 'left',
                padding: '11px 14px',
                borderRadius: 11,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: active ? 'var(--text)' : 'var(--text2)',
                border: `1px solid ${active ? 'var(--violet)' : 'var(--border)'}`,
                background: active ? 'var(--violet-soft)' : 'transparent',
                transition: 'all .12s',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: tone[1] }} />
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn-ghost" onClick={closeModal} disabled={state.saving}>Cancelar</button>
        <button className="btn-primary" onClick={saveWorker} disabled={state.saving}>{state.saving ? <Spinner /> : 'Guardar'}</button>
      </div>
    </ModalShell>
  );
}
