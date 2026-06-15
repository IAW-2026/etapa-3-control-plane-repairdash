'use client';
import { useStore } from '@/lib/store';
import { STATUS_META, TONES } from '@/lib/utils';

const WORKER_STATUSES = ['ONLINE', 'OFFLINE', 'EN_TRABAJO'] as const;

export function WorkerModal() {
  const { state, dispatch, closeModal, saveWorker } = useStore();
  const { modal } = state;
  if (modal?.type !== 'worker') return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: 'min(440px, 100%)', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 17, fontWeight: 700 }}>Cambiar estado · {modal.name}</span>
          <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>PATCH /api/control-plane/workers/{modal.id}/status</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {WORKER_STATUSES.map(st => {
            const meta = STATUS_META[st];
            const tone = TONES[meta.tone];
            const active = modal.status === st;
            return (
              <div
                key={st}
                onClick={() => dispatch({ type: 'SET_MODAL_WORKER_STATUS', payload: st })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', borderRadius: 11, cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, color: active ? 'var(--text)' : 'var(--text2)',
                  border: `1px solid ${active ? 'var(--violet)' : 'var(--border)'}`,
                  background: active ? 'var(--violet-soft)' : 'transparent',
                  transition: 'all .12s',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: tone[1] }} />
                <span>{meta.label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={closeModal}>Cancelar</button>
          <button className="btn-primary" onClick={saveWorker}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
