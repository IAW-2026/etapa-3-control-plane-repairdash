import { Skeleton } from '@/components/ui/Skeleton';
import { fdate } from '@/lib/utils';

export function CommissionSummaryCard({
  loading,
  rate,
  updatedAt,
  onEdit,
}: {
  loading: boolean;
  rate: string | number | null;
  updatedAt: string;
  onEdit: () => void;
}) {
  return (
    <div style={{ background: 'linear-gradient(135deg, var(--violet-soft), var(--pink-soft)), var(--surface)', border: '1px solid var(--border2)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 600, fontSize: 15 }}>Comision de plataforma</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        {loading ? (
          <Skeleton w={90} h={38} style={{ margin: '4px 0' }} />
        ) : (
          <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 38, fontWeight: 700, letterSpacing: '-.02em' }}>{rate == null ? '---' : rate + '%'}</span>
        )}
        {!loading && updatedAt && <span style={{ fontSize: 12, color: 'var(--text3)' }}>act. {fdate(updatedAt)}</span>}
      </div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--text2)' }}>Unica mutacion habilitada por Payments en v1. Se aplica a las transacciones liquidadas.</p>
      <button onClick={onEdit} className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
        Ajustar comision
      </button>
    </div>
  );
}
