'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { fdate } from '@/lib/utils';

export function CommissionView() {
  const { state, dispatch, saveCommission, fetchCommission } = useStore();
  const { data, commissionInput, commissionError } = state;
  const rate = data.commission.rate;

  // Load the current commission from Payments.
  useEffect(() => { fetchCommission(); }, [fetchCommission]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: 'var(--font-grotesk)', fontSize: 'clamp(21px, 3vw, 25px)', fontWeight: 700, margin: 0, letterSpacing: '-.015em' }}>Comisión de plataforma</h1>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: 'var(--mag-soft)', color: 'var(--mag)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--mag)' }} />Payments
          </span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>PATCH /api/control-plane/commission</span>
      </div>

      <div className="card" style={{ gap: 18, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>Vigente</span>
            <span style={{
              fontFamily: 'var(--font-grotesk)', fontSize: 46, fontWeight: 700, letterSpacing: '-.02em',
              background: 'linear-gradient(120deg, var(--violet), var(--pink))',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>
              {rate}%
            </span>
          </div>
          <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>Última actualización: {fdate(data.commission.updatedAt)}</span>
        </div>

        <div style={{ height: 1, background: 'var(--border)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>Nueva comisión (%)</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              placeholder="10.00"
              value={commissionInput}
              onChange={e => dispatch({ type: 'SET_COMMISSION_INPUT', payload: e.target.value })}
              style={{
                flex: 1, minWidth: 140, maxWidth: 200,
                padding: '10px 13px', borderRadius: 10,
                border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)',
                fontSize: 15, outline: 'none', fontFamily: 'var(--font-mono)',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--violet)'; e.target.style.boxShadow = '0 0 0 3px var(--violet-soft)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
            <button className="btn-primary" onClick={saveCommission}>Guardar cambios</button>
          </div>
          {commissionError && <span style={{ fontSize: 12.5, color: 'var(--danger)' }}>{commissionError}</span>}
          <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>String decimal entre 0 y 100, hasta 2 decimales. Se envía con actor y motivo para trazabilidad.</span>
        </div>
      </div>

      <div style={{ padding: '13px 16px', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--surface)', fontSize: 13, color: 'var(--text2)' }}>
        Es la <strong>única mutación</strong> que Payments expone a Control Plane en v1. Liquidaciones, retiros, refunds y disputas quedan fuera de alcance.
      </div>
    </div>
  );
}
