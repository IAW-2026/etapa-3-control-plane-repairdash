import type { Prueba } from '@/lib/types';

export function ReportEvidenceList({ pruebas }: { pruebas: Prueba[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)' }}>Pruebas adjuntas</span>
      {pruebas.length > 0 ? (
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          {pruebas.map(prueba => (
            <div key={prueba.id} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 12.5, color: 'var(--text2)' }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: prueba.tipo === 'video' ? 'var(--violet)' : 'var(--pink)' }} />
              {prueba.tipo === 'video' ? 'Video' : 'Imagen'}
            </div>
          ))}
        </div>
      ) : (
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>Sin pruebas adjuntas.</span>
      )}
    </div>
  );
}
