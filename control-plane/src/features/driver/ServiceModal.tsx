'use client';
import { FormField } from '@/components/common/FormField';
import { ModalShell } from '@/components/common/ModalShell';
import { Spinner } from '@/components/ui/Spinner';
import { useStore } from '@/lib/store';

export function ServiceModal() {
  const { state, dispatch, closeModal, saveService } = useStore();
  const { modal, form, formError } = state;
  if (modal?.type !== 'service') return null;

  const isEdit = !!modal.id;
  const setField = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    dispatch({ type: 'SET_FORM_FIELD', payload: { key: key as 'nombre', value: e.target.value } });

  return (
    <ModalShell width="min(460px, 100%)">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 17, fontWeight: 700 }}>
          {isEdit ? 'Editar tipo de servicio' : 'Nuevo tipo de servicio'}
        </span>
      </div>
      <FormField label="Nombre">
        <input value={String(form.nombre || '')} onChange={setField('nombre')} className="input-base" />
      </FormField>
      <FormField label="Descripcion">
        <textarea value={String(form.descripcion || '')} onChange={setField('descripcion')} rows={2} className="input-base" style={{ resize: 'vertical' }} />
      </FormField>
      <FormField label="Precio base (ARS)">
        <input type="number" value={form.precio == null ? '' : String(form.precio)} onChange={setField('precio')} className="input-base" style={{ maxWidth: 180 }} />
      </FormField>
      {formError && <span style={{ fontSize: 12.5, color: 'var(--danger)' }}>{formError}</span>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn-ghost" onClick={closeModal} disabled={state.saving}>Cancelar</button>
        <button className="btn-primary" onClick={saveService} disabled={state.saving}>{state.saving ? <Spinner /> : 'Guardar'}</button>
      </div>
    </ModalShell>
  );
}
