import { SectionCard } from '@/components/common/SectionCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { TransactionBar } from './types';

export function TransactionStatusBars({ bars, loading }: { bars: TransactionBar[]; loading: boolean }) {
  return (
    <SectionCard style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 600, fontSize: 15 }}>Transacciones por estado</span>
        <span style={{ fontSize: 11.5, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>payments /summary</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {bars.map(bar => (
          <div key={bar.label} style={{ display: 'grid', gridTemplateColumns: '96px 1fr 28px', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 12.5, color: 'var(--text2)' }}>{bar.label}</span>
            {loading ? (
              <Skeleton h={8} radius={99} />
            ) : (
              <div style={{ height: 8, borderRadius: 99, background: 'var(--surface2)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, var(--violet), var(--pink))', width: bar.w + '%' }} />
              </div>
            )}
            {loading ? <Skeleton w={20} h={12} style={{ marginLeft: 'auto' }} /> : <span style={{ fontSize: 12.5, fontWeight: 600, textAlign: 'right' }}>{bar.count}</span>}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
