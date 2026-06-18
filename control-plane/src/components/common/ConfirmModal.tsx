'use client';
import { useStore } from '@/lib/store';
import { ModalShell } from './ModalShell';

export function ConfirmModal() {
  const { state, closeModal } = useStore();
  const { modal } = state;
  if (modal?.type !== 'confirm') return null;

  return (
    <ModalShell width="min(420px, 100%)" label={modal.title}>
      <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 17, fontWeight: 700 }}>{modal.title}</span>
      <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text2)' }}>{modal.desc}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn-ghost" onClick={closeModal}>Cancelar</button>
        <button className="btn-danger" onClick={() => { modal.fn(); }}>Eliminar</button>
      </div>
    </ModalShell>
  );
}
