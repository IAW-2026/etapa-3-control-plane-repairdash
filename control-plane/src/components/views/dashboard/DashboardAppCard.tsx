import { SectionCard } from '@/components/common/SectionCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { AppCard } from './types';

export function DashboardAppCard({ card, loading }: { card: AppCard; loading: boolean }) {
  return (
    <SectionCard style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: card.dot }} />
        <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 600, fontSize: 15.5 }}>{card.name}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999, background: 'var(--ok-soft)', color: 'var(--ok)' }}>Operativa</span>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, alignContent: 'start' }}>
        {card.stats.map((stat, index) => (
          <div key={index}>
            {loading ? (
              <Skeleton w={36} h={25} style={{ margin: '3px 0 4px' }} />
            ) : (
              <div style={{ fontFamily: 'var(--font-grotesk)', fontSize: 25, fontWeight: 700, color: stat.color || 'var(--text)' }}>{stat.val}</div>
            )}
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>{stat.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16, borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 'auto' }}>
        {card.links.map(link => (
          <button
            key={link.label}
            type="button"
            onClick={link.go}
            style={{ border: 'none', background: 'none', padding: 0, fontSize: 13, fontWeight: 600, color: link.color, cursor: 'pointer' }}
          >
            {link.label}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}