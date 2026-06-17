import { FormField } from '@/components/common/FormField';
import { Spinner } from '@/components/ui/Spinner';
import { useStore } from '@/lib/store';

export function CommissionForm() {
  const { state, dispatch, saveCommission } = useStore();
  const { commissionInput, commissionError } = state;

  return (
    <FormField
      label="Nueva comision (%)"
      error={commissionError}
      help="String decimal entre 0 y 100, hasta 2 decimales. Se envia con actor y motivo para trazabilidad."
    >
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          placeholder="10.00"
          value={commissionInput}
          onChange={e => dispatch({ type: 'SET_COMMISSION_INPUT', payload: e.target.value })}
          style={{
            flex: 1,
            minWidth: 140,
            maxWidth: 200,
            padding: '10px 13px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text)',
            fontSize: 15,
            outline: 'none',
            fontFamily: 'var(--font-mono)',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--violet)'; e.target.style.boxShadow = '0 0 0 3px var(--violet-soft)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
        />
        <button className="btn-primary" onClick={saveCommission} disabled={state.saving}>
          {state.saving ? <Spinner /> : 'Guardar cambios'}
        </button>
      </div>
    </FormField>
  );
}
