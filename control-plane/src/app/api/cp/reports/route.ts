import { NextRequest, NextResponse } from 'next/server';
import { ENV, fbHeaders, configured } from '@/lib/server/config';
import type { Report } from '@/lib/types';

function normalizeList(r: Record<string, unknown>): Report {
  return {
    id:           (r.id          as string) || '',
    idTrabajo:    (r.idTrabajo   as string) || '',
    idReportante: (r.idReportante as string) || '',
    idReportado:  (r.idReportado  as string) || '',
    estado:       (r.estado      as Report['estado'])    || 'CREADO',
    resolucion:   (r.resolucion  as Report['resolucion']) || 'SinResolver',
    decision:     (r.decision    as Report['decision'])  ?? null,
    descripcion:  (r.descripcion as string) || '',
    creadoEn:     (r.creadoEn   as string) || '',
    reportante: {
      id:       (r.reportante as Record<string, unknown> | undefined)?.id       as string  || '',
      nombre:   (r.reportante as Record<string, unknown> | undefined)?.nombre   as string  || '—',
      apellido: (r.reportante as Record<string, unknown> | undefined)?.apellido as string  || '',
      rol:      (r.reportante as Record<string, unknown> | undefined)?.rol      as string  || 'rider',
    } as Report['reportante'],
    reportado: {
      id:       (r.reportado as Record<string, unknown> | undefined)?.id       as string  || '',
      nombre:   (r.reportado as Record<string, unknown> | undefined)?.nombre   as string  || '—',
      apellido: (r.reportado as Record<string, unknown> | undefined)?.apellido as string  || '',
      rol:      (r.reportado as Record<string, unknown> | undefined)?.rol      as string  || 'driver',
    } as Report['reportado'],
    trabajo:      { id: '', tipoDeTrabajo: '—', fechaInicio: '', fechaFin: null },
    pruebas:      [],
  };
}

export async function GET(req: NextRequest) {
  if (!configured(ENV.feedback.base)) {
    return NextResponse.json({ items: [], totalPages: 1, total: 0 });
  }
  try {
    const sp = new URLSearchParams();
    const q      = req.nextUrl.searchParams.get('q')        || '';
    const estado = req.nextUrl.searchParams.get('status')   || '';
    const resol  = req.nextUrl.searchParams.get('resFilter')|| '';
    const page   = req.nextUrl.searchParams.get('page')     || '1';
    if (estado && estado !== 'ALL')  sp.set('estado',    estado);
    if (resol  && resol  !== 'ALL')  sp.set('resolucion', resol);
    sp.set('page',  page);
    sp.set('limit', '20');

    const res = await fetch(`${ENV.feedback.base}/api/control-plane/reports?${sp}`, {
      headers: fbHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
    const json = await res.json();

    let items: Report[] = (json.data || []).map(normalizeList);

    // client-side text search since the endpoint might not support q
    if (q) {
      const fq = q.toLowerCase();
      items = items.filter(r =>
        `${r.id} ${r.idTrabajo} ${r.descripcion} ${r.idReportante} ${r.idReportado}`
          .toLowerCase().includes(fq)
      );
    }

    return NextResponse.json({
      items,
      totalPages: Math.max(1, Math.ceil((json.total || items.length) / 20)),
      total:      json.total || items.length,
    });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con Feedback' }, { status: 503 });
  }
}
