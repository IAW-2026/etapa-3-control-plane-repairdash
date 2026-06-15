'use client';
import { useStore } from '@/lib/store';

export function ClienteModal() {
  const { state, dispatch, closeModal, saveCliente } = useStore();
  const { modal, form, formError } = state;
  if (modal?.type !== 'cliente') return null;

  const setField = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: 'SET_FORM_FIELD', payload: { key: key as 'nombre', value: e.target.value } });

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: 'min(440px, 100%)', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 17, fontWeight: 700 }}>Editar cliente</span>
          <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>PUT /api/super-admin/clientes/{modal.id}</span>
        </div>
        {(['nombre', 'apellido'] as const).map(field => (
          <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>{field === 'nombre' ? 'Nombre' : 'Apellido'}</label>
            <input
              value={String(form[field] || '')}
              onChange={setField(field)}
              className="input-base"
            />
          </div>
        ))}
        {formError && <span style={{ fontSize: 12.5, color: 'var(--danger)' }}>{formError}</span>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={closeModal}>Cancelar</button>
          <button className="btn-primary" onClick={saveCliente}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
