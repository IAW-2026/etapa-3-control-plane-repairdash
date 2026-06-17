import type { ReportUser } from '@/lib/types';

const roleLabel = (role: string) => role === 'rider' ? 'Rider' : 'Driver';

export function ReportPeopleCards({ reportante, reportado }: { reportante: ReportUser; reportado: ReportUser }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {[
        { label: 'Reportante', user: reportante },
        { label: 'Reportado', user: reportado },
      ].map(({ label, user }) => (
        <div key={label} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '13px 14px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)' }}>{label}</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{user.nombre} {user.apellido}</span>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>{roleLabel(user.rol)}</span>
        </div>
      ))}
    </div>
  );
}
