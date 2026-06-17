import { AppBadge } from '@/components/common/AppBadge';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { Skeleton, TableSkeleton } from '@/components/ui/Skeleton';
import type { TableMeta } from '@/components/table/meta';

export function TableRouteLoading({
  meta,
  cols = 5,
}: {
  meta: Pick<TableMeta, 'title' | 'sub' | 'app' | 'tone' | 'statuses' | 'dates' | 'search' | 'create' | 'createLabel'>;
  cols?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1280, margin: '0 auto' }}>
      <PageHeader
        title={meta.title}
        subtitle={meta.sub}
        badge={meta.app ? <AppBadge label={meta.app} tone={meta.tone} /> : null}
        action={meta.create ? <Skeleton w={170} h={37} radius={10} /> : null}
      />

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', margin: '18px 0 14px' }}>
        <Skeleton w={300} h={37} radius={10} />
        {meta.statuses && <Skeleton w={170} h={37} radius={10} />}
        {meta.dates && (
          <>
            <Skeleton w={135} h={37} radius={10} />
            <Skeleton w={135} h={37} radius={10} />
          </>
        )}
        <Skeleton w={90} h={13} style={{ marginLeft: 'auto' }} />
      </div>

      <SectionCard style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap" style={{ overflowX: 'auto' }}>
          <TableSkeleton cols={cols} />
        </div>
      </SectionCard>
    </div>
  );
}

export function FeedbackRouteLoading() {
  const cards = ['Abiertos', 'En revision', 'Resueltos', 'Reviews pend.'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1280, margin: '0 auto' }}>
      <PageHeader
        title="Feedback y disputas"
        subtitle={
          <>
            Reportes y disputas entre riders y drivers. Feedback es la fuente de verdad: resolver una disputa aca{' '}
            <strong>no modifica Payments</strong> (no frena, destraba ni reembolsa pagos).
          </>
        }
        badge={<AppBadge label="Feedback" tone="pink" />}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {cards.map(card => (
          <SectionCard key={card} style={{ borderRadius: 14, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Skeleton w={48} h={27} style={{ margin: '4px 0 3px' }} />
            <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>{card}</span>
          </SectionCard>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <Skeleton w={320} h={37} radius={10} />
        <Skeleton w={170} h={37} radius={10} />
        <Skeleton w={160} h={37} radius={10} />
        <Skeleton w={90} h={13} style={{ marginLeft: 'auto' }} />
      </div>

      <SectionCard style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap" style={{ overflowX: 'auto' }}>
          <TableSkeleton cols={6} />
        </div>
      </SectionCard>
    </div>
  );
}
