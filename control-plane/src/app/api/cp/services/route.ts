import { NextRequest, NextResponse } from 'next/server';
import { ENV, drHeaders, actor, configured } from '@/lib/server/config';
import type { ServiceType } from '@/lib/types';

function normalize(s: Record<string, unknown>): ServiceType {
  return {
    id:          (s.id as string)           || '',
    nombre:      (s.nombre as string)       || '',
    descripcion: (s.descripcion as string)  || '',
    precioBase:  (s.precioBase as number)   || 0,
    drivers:     (s.driversAsignados as number) || 0,
    activos:     (s.trabajosActivos as number)  || 0,
  };
}

export async function GET(req: NextRequest) {
  if (!configured(ENV.driver.base)) {
    return NextResponse.json({ items: [], totalPages: 1, total: 0 });
  }
  try {
    const sp = new URLSearchParams();
    const q    = req.nextUrl.searchParams.get('q')    || '';
    const page = req.nextUrl.searchParams.get('page') || '1';
    if (q) sp.set('q', q);
    sp.set('page', page);
    sp.set('limit', '20');

    const res = await fetch(`${ENV.driver.base}/api/control-plane/service-types?${sp}`, {
      headers: drHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
    const json = await res.json();

    const items: ServiceType[] = (json.data || []).map(normalize);
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

export async function POST(req: NextRequest) {
  if (!configured(ENV.driver.base)) {
    return NextResponse.json({ error: 'DriverApp no configurado' }, { status: 503 });
  }
  try {
    const { nombre, descripcion, precioBase } = await req.json();
    const res = await fetch(`${ENV.driver.base}/api/control-plane/service-types`, {
      method: 'POST',
      headers: { ...drHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre, descripcion, precioBase,
        ...actor(),
        reason: 'Alta de tipo de servicio desde Control Plane',
      }),
    });
    const json = await res.json();
    if (!res.ok) return NextResponse.json(json, { status: res.status });
    return NextResponse.json({ data: normalize(json.data || json) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con DriverApp' }, { status: 503 });
  }
}
