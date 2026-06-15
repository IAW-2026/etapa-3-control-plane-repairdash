import { NextRequest, NextResponse } from 'next/server';
import { ENV, drHeaders, configured } from '@/lib/server/config';
import type { Job } from '@/lib/types';

function normalize(j: Record<string, unknown>): Job {
  const rider  = j.rider  as Record<string, unknown> | null;
  const driver = j.driver as Record<string, unknown> | null;
  const svc    = j.tipoServicio as Record<string, unknown> | null;
  return {
    id:       (j.id as string) || '',
    estado:   (j.estado as string) || '',
    rider:    rider  ? `${rider.nombre}  ${rider.apellido}`.trim()  : '—',
    driver:   driver ? `${driver.nombre} ${driver.apellido}`.trim() : null,
    servicio: svc    ? (svc.nombre as string) : '—',
    direccion:(j.direccion as string) || '—',
    monto:    (j.montoEstimado as number) || 0,
    creadoEn: (j.creadoEn as string) || '',
  };
}

export async function GET(req: NextRequest) {
  if (!configured(ENV.driver.base)) {
    return NextResponse.json({ items: [], totalPages: 1, total: 0 });
  }
  try {
    const sp = new URLSearchParams();
    const q      = req.nextUrl.searchParams.get('q')      || '';
    const status = req.nextUrl.searchParams.get('status') || '';
    const page   = req.nextUrl.searchParams.get('page')   || '1';
    if (q)                       sp.set('q', q);
    if (status && status !== 'ALL') sp.set('estado', status);
    sp.set('page', page);
    sp.set('limit', '20');

    const res = await fetch(`${ENV.driver.base}/api/control-plane/jobs?${sp}`, {
      headers: drHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
    const json = await res.json();

    const items: Job[] = (json.data || []).map(normalize);
    const pag = json.pagination || {};
    return NextResponse.json({
      items,
      totalPages: pag.totalPages || 1,
      total:      pag.total      || items.length,
    });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con DriverApp' }, { status: 503 });
  }
}
