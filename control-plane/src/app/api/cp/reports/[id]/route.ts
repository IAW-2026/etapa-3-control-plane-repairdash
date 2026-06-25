import { NextResponse } from 'next/server';
import { ENV, fbHeaders, configured } from '@/lib/server/config';
import type { Report } from '@/lib/types';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!configured(ENV.feedback.base)) {
    return NextResponse.json({ error: 'Feedback no configurado' }, { status: 503 });
  }
  try {
    const res = await fetch(
      `${ENV.feedback.base}/api/control-plane/reports/${encodeURIComponent(id)}`,
      { headers: fbHeaders(), cache: 'no-store' }
    );
    if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: res.status });
    const r = await res.json();

    const report: Report = {
      id:           r.id           || '',
      idTrabajo:    r.idTrabajo    || '',
      idReportante: r.idReportante || '',
      idReportado:  r.idReportado  || '',
      estado:       r.estado       || 'CREADO',
      resolucion:   r.resolucion   || 'SinResolver',
      decision:     r.decision     ?? null,
      descripcion:  r.descripcion  || '',
      creadoEn:     r.creadoEn     || '',
      reportante: {
        id:       r.reportante?.id       || '',
        nombre:   r.reportante?.nombre   || '—',
        apellido: r.reportante?.apellido || '',
        rol:      r.reportante?.rol      || 'rider',
      },
      reportado: {
        id:       r.reportado?.id       || '',
        nombre:   r.reportado?.nombre   || '—',
        apellido: r.reportado?.apellido || '',
        rol:      r.reportado?.rol      || 'driver',
      },
      trabajo: {
        id:            r.trabajo?.id            || '',
        tipoDeTrabajo: r.trabajo?.tipoDeTrabajo || '—',
        fechaInicio:   r.trabajo?.fechaInicio   || '',
        fechaFin:      r.trabajo?.fechaFin      ?? null,
      },
      pruebas: (r.pruebas || []).map((p: Record<string, unknown>) => ({
        id:   p.id   || '',
        tipo: p.tipo || 'imagen',
        url:  p.url  || '',
      })),
    };

    return NextResponse.json({ data: report });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con Feedback' }, { status: 503 });
  }
}
