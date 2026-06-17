import { SectionCard } from '@/components/common/SectionCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { SummaryData } from '@/lib/types';

const fmt = (v: number | null | undefined) => (v == null ? '---' : v);

export function FeedbackSummaryCards({ summary }: { summary: SummaryData | null }) {
  const fb = summary?.feedback;
  const cards = [
    { label: 'Abiertos', value: fmt(fb?.reportesAbiertos), color: 'var(--warn)' },
    { label: 'En revision', value: fmt(fb?.reportesEnRevision), color: 'var(--violet)' },
    { label: 'Resueltos', value: fmt(fb?.reportesResueltos), color: 'var(--ok)' },
    { label: 'Reviews pend.', value: fmt(fb?.reviewsPendientes), color: 'var(--text)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
      {cards.map(card => (
        <SectionCard key={card.label} style={{ borderRadius: 14, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {summary ? (
            <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 27, fontWeight: 700, color: card.color }}>{card.value}</span>
          ) : (
            <Skeleton w={48} h={27} style={{ margin: '4px 0 3px' }} />
          )}
          <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>{card.label}</span>
        </SectionCard>
      ))}
    </div>
  );
}
