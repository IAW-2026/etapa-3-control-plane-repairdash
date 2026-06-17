import { Skeleton } from '@/components/ui/Skeleton';
import { fdate } from '@/lib/utils';

export function CurrentCommissionCard({ loading, rate, updatedAt }: { loading: boolean; rate: string; updatedAt: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>Vigente</span>
        {loading ? (
          <Skeleton w={120} h={46} style={{ margin: '4px 0' }} />
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-grotesk)',
              fontSize: 46,
              fontWeight: 700,
              letterSpacing: '-.02em',
              background: 'linear-gradient(120deg, var(--violet), var(--pink))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {rate}%
          </span>
        )}
      </div>
      {loading ? <Skeleton w={170} h={13} /> : <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>Ultima actualizacion: {fdate(updatedAt)}</span>}
    </div>
  );
}
