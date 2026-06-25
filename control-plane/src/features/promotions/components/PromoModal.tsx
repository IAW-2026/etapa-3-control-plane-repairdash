'use client';
import { useState } from 'react';
import { FormField } from '@/components/common/FormField';
import { ModalShell } from '@/components/common/ModalShell';
import { Spinner } from '@/components/ui/Spinner';
import { useStore } from '@/lib/store';
import { PromotionCategoryPicker } from './PromotionCategoryPicker';
import { PromotionDateFields } from './PromotionDateFields';
import { PromotionFlags } from './PromotionFlags';
import { SegmentedDiscountType } from './SegmentedDiscountType';
import { useServiceTypes } from '../useServiceTypes';
import FiltroUsuariosSelector from './FiltroUsuariosSelector';
import type { FiltroUsuarios } from '@/lib/types';

export function PromoModal() {
  const { state, dispatch, closeModal, savePromo } = useStore();
  const { services, loading } = useServiceTypes();
  const [filtroError, setFiltroError] = useState(false);
  const [precioMinimoError, setPrecioMinimoError] = useState<string | null>(null);

  const { modal, form, formError } = state;
  if (modal?.type !== 'promo') return null;

  const isEdit = modal.id !== null;
  const tipo = (form.tipoDescuento || '%') as '%' | '$';

  const setFormField = (key: string, value: string | number | boolean | string[] | '%' | '$' | FiltroUsuarios | null) =>
    dispatch({ type: 'SET_FORM_FIELD', payload: { key: key as 'nombre', value } });
  const setField = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormField(key, e.target.value);

  const toggleCat = (cat: string) => {
    const cs = [...(form.categorias || [])];
    const i = cs.indexOf(cat);
    if (i >= 0) cs.splice(i, 1); else cs.push(cat);
    setFormField('categorias', cs);
  };

  const validatePrecioMinimo = (): boolean => {
    if (tipo !== '$') {
      setPrecioMinimoError(null);
      return true;
    }
    const valor = Number(form.valor);
    const precioMinimo = Number(form.precioMinimo);

    if (form.precioMinimo == null || form.precioMinimo === '' as unknown) {
      setPrecioMinimoError('El precio mínimo es obligatorio cuando el descuento es un monto fijo.');
      return false;
    }
    if (precioMinimo < valor) {
      setPrecioMinimoError(`El precio mínimo debe ser mayor o igual al descuento ($${valor}).`);
      return false;
    }
    setPrecioMinimoError(null);
    return true;
  };

  const handleSave = () => {
    if (filtroError) return;
    if (!validatePrecioMinimo()) return;
    savePromo();
  };

  return (
    <ModalShell width="min(540px, 100%)" top label={isEdit ? 'Editar promocion' : 'Nueva promocion'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 17, fontWeight: 700 }}>
          {isEdit ? 'Editar promocion' : 'Nueva promocion'}
        </span>
      </div>

      <FormField label="Nombre">
        <input value={String(form.nombre || '')} onChange={setField('nombre')} className="input-base" />
      </FormField>

      <FormField label="Descripcion">
        <textarea value={String(form.descripcion || '')} onChange={setField('descripcion')} rows={2} className="input-base" style={{ resize: 'vertical' }} />
      </FormField>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormField label="Tipo de descuento">
          <SegmentedDiscountType
            value={tipo}
            onChange={value => {
              setFormField('tipoDescuento', value);
              setPrecioMinimoError(null);
            }}
          />
        </FormField>
        <FormField label={`Valor (${tipo === '$' ? 'ARS' : '%'})`}>
          <input type="number" value={form.valor == null ? '' : String(form.valor)} onChange={setField('valor')} className="input-base" />
        </FormField>
      </div>

      <PromotionCategoryPicker services={services} loading={loading} selected={form.categorias || []} onToggle={toggleCat} />
      <PromotionDateFields
        fechaInicio={String(form.fechaInicio || '')}
        fechaFin={String(form.fechaFin || '')}
        onChange={(key, value) => setFormField(key, value)}
      />

      <FormField
        label={
          <span>
            Precio minimo{' '}
            <span style={{ color: tipo === '$' ? 'var(--danger)' : 'var(--text3)', fontWeight: 400 }}>
              {tipo === '$' ? '(requerido, ARS)' : '(opcional, ARS)'}
            </span>
          </span>
        }
      >
        <input
          type="number"
          value={form.precioMinimo == null ? '' : String(form.precioMinimo)}
          onChange={e => {
            setField('precioMinimo')(e);
            setPrecioMinimoError(null);
          }}
          className="input-base"
          style={{ maxWidth: 200 }}
        />
        {precioMinimoError && (
          <span style={{ fontSize: 12.5, color: 'var(--danger)', marginTop: 4, display: 'block' }}>
            {precioMinimoError}
          </span>
        )}
      </FormField>

      <PromotionFlags
        values={{ destacada: !!form.destacada, usoUnico: !!form.usoUnico }}
        onToggle={key => setFormField(key, !form[key])}
      />

      <FiltroUsuariosSelector
        value={(form.filtroUsuarios as FiltroUsuarios | null) ?? null}
        onChange={(filtro) => setFormField('filtroUsuarios', filtro)}
        onError={setFiltroError}
      />

      {formError && <span style={{ fontSize: 12.5, color: 'var(--danger)' }}>{formError}</span>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn-ghost" onClick={closeModal} disabled={state.saving}>Cancelar</button>
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={state.saving || filtroError}
          aria-busy={state.saving}
        >
          {state.saving ? <Spinner /> : 'Guardar'}
        </button>
      </div>
    </ModalShell>
  );
}