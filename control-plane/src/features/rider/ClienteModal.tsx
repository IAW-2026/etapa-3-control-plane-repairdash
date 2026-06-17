'use client';
import { FormField } from '@/components/common/FormField';
import { ModalShell } from '@/components/common/ModalShell';
import { Spinner } from '@/components/ui/Spinner';
import { useStore } from '@/lib/store';

export function ClienteModal() {
  const { state, dispatch, closeModal, saveCliente } = useStore();
  const { modal, form, formError } = state;
  if (modal?.type !== 'cliente') return null;

  const setField = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: 'SET_FORM_FIELD', payload: { key: key as 'nombre', value: e.target.value } });

  return (
    <ModalShell width="min(440px, 100%)">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 17, fontWeight: 700 }}>Editar cliente</span>
      </div>
      {(['nombre', 'apellido'] as const).map(field => (
        <FormField key={field} label={field === 'nombre' ? 'Nombre' : 'Apellido'}>
          <input value={String(form[field] || '')} onChange={setField(field)} className="input-base" />
        </FormField>
      ))}
      {formError && <span style={{ fontSize: 12.5, color: 'var(--danger)' }}>{formError}</span>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn-ghost" onClick={closeModal} disabled={state.saving}>Cancelar</button>
        <button className="btn-primary" onClick={saveCliente} disabled={state.saving}>{state.saving ? <Spinner /> : 'Guardar'}</button>
      </div>
    </ModalShell>
  );
}
