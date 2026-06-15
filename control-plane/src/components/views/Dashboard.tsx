'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { fdate, STATUS_META } from '@/lib/utils';

const n = (v: number | null | undefined) => (v == null ? '—' : v);
const sumValues = (o: Record<string, number> | null | undefined) =>
  o ? Object.values(o).reduce((a, b) => a + b, 0) : null;

export function Dashboard() {
  const { state, navigate, fetchSummary } = useStore();
  const { summary, summaryLoading } = state;

  // Consolidated operative state from /api/cp/summary (RepairDash, DriverApp,
  // Payments, Feedback and Promociones).
  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const rd = summary?.repairdash;
  const dr = summary?.driver;
  const pm = summary?.payments;
  const fb = summary?.feedback;
  const promo = summary?.promociones;

  const txByStatus = pm?.transactionsByStatus || null;
  const txMax = Math.max(1, ...Object.values(txByStatus || {}));
  const txBars = ['PENDING','RESERVED','LIQUIDATED','TRANSFERRED','DISPUTED','REFUNDED','FAILED'].map(st => {
    const count = txByStatus?.[st] ?? 0;
    return { label: STATUS_META[st].label, count, w: Math.round((count / txMax) * 100) };
  });

  const sumWdRequested = pm?.withdrawalsByStatus?.REQUESTED ?? null;
  const commissionRate = pm?.commission?.commissionRate ?? null;
  const commissionUpdated = pm?.commission?.updatedAt ?? '';

  const appCards = [
    {
      name: 'RepairDash', dot: 'var(--pink)',
      stats: [
        { val: n(rd?.clientes), label: 'Clientes' },
        { val: n(rd?.viajes), label: 'Viajes' },
      ],
      links: [{ label: 'Clientes →', color: 'var(--pink)', go: () => navigate('clientes') }, { label: 'Viajes →', color: 'var(--pink)', go: () => navigate('viajes') }],
    },
    {
      name: 'DriverApp', dot: 'var(--violet)',
      stats: [
        { val: n(dr?.workers?.total), label: 'Trabajadores' },
        { val: n(dr?.workers?.online), label: 'Online', color: 'var(--ok)' },
        { val: n(dr?.jobs?.activos), label: 'Trabajos activos' },
      ],
      links: [{ label: 'Trabajadores →', color: 'var(--violet)', go: () => navigate('workers') }, { label: 'Trabajos →', color: 'var(--violet)', go: () => navigate('jobs') }],
    },
    {
      name: 'Payments', dot: 'var(--mag)',
      stats: [
        { val: n(sumValues(txByStatus)), label: 'Transacciones' },
        { val: n(sumWdRequested), label: 'Retiros pend.', color: 'var(--warn)' },
        { val: commissionRate == null ? '—' : commissionRate + '%', label: 'Comisión' },
      ],
      links: [{ label: 'Transacciones →', color: 'var(--mag)', go: () => navigate('transactions') }, { label: 'Retiros →', color: 'var(--mag)', go: () => navigate('withdrawals') }],
    },
    {
      name: 'Feedback', dot: 'var(--pink)',
      stats: [
        { val: n(fb?.reportesAbiertos), label: 'Abiertos', color: 'var(--warn)' },
        { val: n(fb?.reportesEnRevision), label: 'En revisión', color: 'var(--violet)' },
        { val: n(fb?.reportesResueltos), label: 'Resueltos' },
      ],
      links: [{ label: 'Disputas →', color: 'var(--pink)', go: () => navigate('feedback') }],
    },
    {
      name: 'Promociones', dot: 'var(--pink)',
      stats: [
        { val: n(promo?.total), label: 'Promociones', color: 'var(--ok)' },
        { val: n(promo?.usos), label: 'Usos' },
      ],
      links: [{ label: 'Promociones →', color: 'var(--pink)', go: () => navigate('promotions') }, { label: 'Historial →', color: 'var(--pink)', go: () => navigate('historial') }],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1280, margin: '0 auto' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-grotesk)', fontSize: 'clamp(22px, 3vw, 27px)', fontWeight: 700, margin: '0 0 6px', letterSpacing: '-.015em' }}>Visión consolidada</h1>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text2)', maxWidth: '62ch' }}>Estado operativo actual de las tres aplicaciones. Este panel complementa los admins locales: cada app sigue siendo la fuente de verdad de sus datos.{summaryLoading && !summary ? ' Cargando…' : ''}</p>
      </div>

      {/* App cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 16 }}>
        {appCards.map(card => (
          <div key={card.name} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: card.dot }} />
              <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 600, fontSize: 15.5 }}>{card.name}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999, background: 'var(--ok-soft)', color: 'var(--ok)' }}>Operativa</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {card.stats.map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'var(--font-grotesk)', fontSize: 25, fontWeight: 700, color: s.color || 'var(--text)' }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              {card.links.map(l => (
                <span key={l.label} onClick={l.go} style={{ fontSize: 13, fontWeight: 600, color: l.color, cursor: 'pointer' }}>{l.label}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 16, alignItems: 'start' }}>
        {/* Tx by status bar chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 600, fontSize: 15 }}>Transacciones por estado</span>
            <span style={{ fontSize: 11.5, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>payments /summary</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {txBars.map(b => (
              <div key={b.label} style={{ display: 'grid', gridTemplateColumns: '96px 1fr 28px', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 12.5, color: 'var(--text2)' }}>{b.label}</span>
                <div style={{ height: 8, borderRadius: 99, background: 'var(--surface2)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, var(--violet), var(--pink))', width: b.w + '%' }} />
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600, textAlign: 'right' }}>{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commission + Withdrawals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'linear-gradient(135deg, var(--violet-soft), var(--pink-soft)), var(--surface)', border: '1px solid var(--border2)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 600, fontSize: 15 }}>Comisión de plataforma</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 38, fontWeight: 700, letterSpacing: '-.02em' }}>{commissionRate == null ? '—' : commissionRate + '%'}</span>
              {commissionUpdated && <span style={{ fontSize: 12, color: 'var(--text3)' }}>act. {fdate(commissionUpdated)}</span>}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text2)' }}>Única mutación habilitada por Payments en v1. Se aplica a las transacciones liquidadas.</p>
            <button onClick={() => navigate('commission')} className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
              Ajustar comisión
            </button>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{n(sumWdRequested)} retiros solicitados</span>
              <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>Solo lectura — se aprueban en el admin de Payments.</span>
            </div>
            <span onClick={() => navigate('withdrawals')} style={{ fontSize: 13, fontWeight: 600, color: 'var(--mag)', cursor: 'pointer', whiteSpace: 'nowrap' }}>Revisar →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
