import { SectionCard } from '@/components/common/SectionCard';

export function ScopeNote() {
  return (
    <SectionCard style={{ padding: '13px 16px', borderRadius: 12, fontSize: 13, color: 'var(--text2)' }}>
      Es la <strong>unica mutacion</strong> que Payments expone a Control Plane en v1. Liquidaciones, retiros, refunds y disputas quedan fuera de alcance.
    </SectionCard>
  );
}
