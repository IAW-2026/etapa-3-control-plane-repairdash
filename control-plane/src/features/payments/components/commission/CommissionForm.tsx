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
          className="input-base"
          inputMode="decimal"
          aria-label="Nueva comisión en porcentaje"
          placeholder="10.00"
          value={commissionInput}
          onChange={e => dispatch({ type: 'SET_COMMISSION_INPUT', payload: e.target.value })}
          style={{
            flex: 1,
            minWidth: 140,
            maxWidth: 200,
            width: 'auto',
            fontSize: 15,
            fontFamily: 'var(--font-mono)',
          }}
        />
        <button className="btn-primary" onClick={saveCommission} disabled={state.saving}>
          {state.saving ? <Spinner /> : 'Guardar cambios'}
        </button>
      </div>
    </FormField>
  );
}
