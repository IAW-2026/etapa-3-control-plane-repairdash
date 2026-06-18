import { ModalShell } from '@/components/common/ModalShell';
import { Skeleton } from '@/components/ui/Skeleton';

export function ReportLoadingState({ id, loading, onClose }: { id: string; loading: boolean; onClose: () => void }) {
  return (
    <ModalShell width="min(560px, 100%)" top label={`Reporte ${id}`} style={{ gap: 16 }}>
      <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 17, fontWeight: 700 }}>Reporte {id}</span>
      {loading ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <Skeleton w="100%" h={13} />
            <Skeleton w="80%" h={13} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[0, 1].map(i => (
              <div key={i} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '13px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                <Skeleton w={70} h={10} />
                <Skeleton w={120} h={14} />
                <Skeleton w={50} h={11} />
              </div>
            ))}
          </div>
          <Skeleton w="100%" h={58} radius={12} />
          <Skeleton w={120} h={10} />
          <div style={{ display: 'flex', gap: 9 }}>
            <Skeleton w={84} h={32} radius={9} />
            <Skeleton w={84} h={32} radius={9} />
          </div>
        </>
      ) : (
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text3)' }}>No se pudo cargar el reporte.</p>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-ghost" onClick={onClose}>Cerrar</button>
      </div>
    </ModalShell>
  );
}
