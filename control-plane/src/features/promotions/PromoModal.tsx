'use client';
import { useStore } from '@/lib/store';
import { Spinner } from '@/components/ui/Spinner';

const CATS = ['Electricidad', 'Plomería', 'Cerrajería', 'Gas', 'Aire acondicionado'];

export function PromoModal() {
  const { state, dispatch, closeModal, savePromo } = useStore();
  const { modal, form, formError } = state;
  if (modal?.type !== 'promo') return null;

  const isEdit = modal.id !== null;
  const setField = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    dispatch({ type: 'SET_FORM_FIELD', payload: { key: key as 'nombre', value: e.target.value } });

  const toggleCat = (cat: string) => {
    const cs = [...(form.categorias || [])];
    const i = cs.indexOf(cat);
    if (i >= 0) cs.splice(i, 1); else cs.push(cat);
    dispatch({ type: 'SET_FORM_FIELD', payload: { key: 'categorias', value: cs } });
  };

  const tipo = form.tipoDescuento || 'porcentaje';

  return (
    <div className="modal-overlay-top">
      <div className="modal-box" style={{ width: 'min(540px, 100%)', gap: 14, margin: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 17, fontWeight: 700 }}>
            {isEdit ? 'Editar promoción' : 'Nueva promoción'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>Nombre</label>
          <input value={String(form.nombre || '')} onChange={setField('nombre')} className="input-base" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>Descripción</label>
          <textarea value={String(form.descripcion || '')} onChange={setField('descripcion')} rows={2} className="input-base" style={{ resize: 'vertical' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>Tipo de descuento</label>
            <div style={{ display: 'flex', padding: 3, borderRadius: 10, background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              {[['porcentaje', 'Porcentaje'], ['monto_fijo', 'Monto fijo']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => dispatch({ type: 'SET_FORM_FIELD', payload: { key: 'tipoDescuento', value: val as 'porcentaje' } })}
                  style={{
                    flex: 1, border: 'none', borderRadius: 8, padding: '8px 6px',
                    fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                    background: tipo === val ? 'var(--surface)' : 'transparent',
                    color: tipo === val ? 'var(--text)' : 'var(--text3)',
                    boxShadow: tipo === val ? '0 1px 4px rgba(20,10,40,.18)' : 'none',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>Valor ({tipo === 'monto_fijo' ? 'ARS' : '%'})</label>
            <input type="number" value={form.valor == null ? '' : String(form.valor)} onChange={setField('valor')} className="input-base" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>Categorías</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATS.map(cat => {
              const sel = (form.categorias || []).includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCat(cat)}
                  style={{
                    border: `1px solid ${sel ? 'var(--pink)' : 'var(--border)'}`,
                    borderRadius: 999, padding: '6px 13px', fontSize: 12.5, fontWeight: 600,
                    cursor: 'pointer', background: sel ? 'var(--pink-soft)' : 'transparent',
                    color: sel ? 'var(--text)' : 'var(--text2)', transition: 'all .12s',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>Fecha de inicio</label>
            <input type="date" value={String(form.fechaInicio || '')} onChange={setField('fechaInicio')} className="input-sm" style={{ color: 'var(--text)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>
              Fecha de fin <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(opcional)</span>
            </label>
            <input type="date" value={String(form.fechaFin || '')} onChange={setField('fechaFin')} className="input-sm" style={{ color: 'var(--text)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>
            Precio mínimo <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(opcional, ARS)</span>
          </label>
          <input type="number" value={form.precioMinimo == null ? '' : String(form.precioMinimo)} onChange={setField('precioMinimo')} className="input-base" style={{ maxWidth: 200 }} />
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { key: 'destacada' as const, label: 'Destacada', activeColor: 'var(--warn)', activeBg: 'var(--warn-soft)', activeBorder: 'var(--warn)' },
            { key: 'usoUnico' as const, label: 'Uso único por usuario', activeColor: 'var(--violet)', activeBg: 'var(--violet-soft)', activeBorder: 'var(--violet)' },
          ].map(({ key, label, activeColor, activeBg, activeBorder }) => {
            const active = !!form[key];
            return (
              <button
                key={key}
                onClick={() => dispatch({ type: 'SET_FORM_FIELD', payload: { key, value: !active } })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  border: `1px solid ${active ? activeBorder : 'var(--border)'}`,
                  borderRadius: 10, padding: '9px 13px', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', background: active ? activeBg : 'transparent',
                  color: 'var(--text2)', transition: 'all .12s',
                }}
              >
                <span style={{ width: 9, height: 9, borderRadius: 3, background: active ? activeColor : 'var(--border2)' }} />
                {label}
              </button>
            );
          })}
        </div>

        {formError && <span style={{ fontSize: 12.5, color: 'var(--danger)' }}>{formError}</span>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={closeModal} disabled={state.saving}>Cancelar</button>
          <button className="btn-primary" onClick={savePromo} disabled={state.saving}>{state.saving ? <Spinner /> : 'Guardar'}</button>
        </div>
      </div>
    </div>
  );
}
