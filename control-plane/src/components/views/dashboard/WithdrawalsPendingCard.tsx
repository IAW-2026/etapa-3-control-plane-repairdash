import { SectionCard } from '@/components/common/SectionCard';
import { Skeleton } from '@/components/ui/Skeleton';

const n = (v: number | null | undefined) => (v == null ? '---' : v);

export function WithdrawalsPendingCard({ loading, requested, onReview }: { loading: boolean; requested: number | null; onReview: () => void }) {
  return (
    <SectionCard style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
        {loading ? (
          <Skeleton w={150} h={14} style={{ margin: '3px 0' }} />
        ) : (
          <span style={{ fontSize: 14, fontWeight: 600 }}>{n(requested)} retiros solicitados</span>
        )}
        <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>Solo lectura - se aprueban en el admin de Payments.</span>
      </div>
      <span onClick={onReview} style={{ fontSize: 13, fontWeight: 600, color: 'var(--mag)', cursor: 'pointer', whiteSpace: 'nowrap' }}>Revisar -&gt;</span>
    </SectionCard>
  );
}
