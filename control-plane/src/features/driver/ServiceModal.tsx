'use client';
import { useStore } from '@/lib/store';
import { Spinner } from '@/components/ui/Spinner';

export function ServiceModal() {
  const { state, dispatch, closeModal, saveService } = useStore();
  const { modal, form, formError } = state;
  if (modal?.type !== 'service') return null;

  const isEdit = !!modal.id;
  const setField = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    dispatch({ type: 'SET_FORM_FIELD', payload: { key: key as 'nombre', value: e.target.value } });

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: 'min(460px, 100%)', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 17, fontWeight: 700 }}>
            {isEdit ? 'Editar tipo de servicio' : 'Nuevo tipo de servicio'}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>Nombre</label>
          <input value={String(form.nombre || '')} onChange={setField('nombre')} className="input-base" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>Descripción</label>
          <textarea
            value={String(form.descripcion || '')}
            onChange={setField('descripcion')}
            rows={2}
            className="input-base"
            style={{ resize: 'vertical' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>Precio base (ARS)</label>
          <input type="number" value={form.precio == null ? '' : String(form.precio)} onChange={setField('precio')} className="input-base" style={{ maxWidth: 180 }} />
        </div>
        {formError && <span style={{ fontSize: 12.5, color: 'var(--danger)' }}>{formError}</span>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={closeModal} disabled={state.saving}>Cancelar</button>
          <button className="btn-primary" onClick={saveService} disabled={state.saving}>{state.saving ? <Spinner /> : 'Guardar'}</button>
        </div>
      </div>
    </div>
  );
}
