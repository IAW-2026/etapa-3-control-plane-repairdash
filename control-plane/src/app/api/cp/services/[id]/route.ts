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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!configured(ENV.driver.base)) {
    return NextResponse.json({ error: 'DriverApp no configurado' }, { status: 503 });
  }
  try {
    const { nombre, descripcion, precioBase } = await req.json();
    const res = await fetch(
      `${ENV.driver.base}/api/control-plane/service-types/${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        headers: { ...drHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre, descripcion, precioBase,
          ...actor(),
          reason: 'Edición de tipo de servicio desde Control Plane',
        }),
      }
    );
    const json = await res.json();
    if (!res.ok) return NextResponse.json(json, { status: res.status });
    return NextResponse.json({ data: normalize(json.data || json) });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con DriverApp' }, { status: 503 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!configured(ENV.driver.base)) {
    return NextResponse.json({ error: 'DriverApp no configurado' }, { status: 503 });
  }
  try {
    const res = await fetch(
      `${ENV.driver.base}/api/control-plane/service-types/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        headers: { ...drHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...actor(),
          reason: 'Baja de tipo de servicio desde Control Plane',
        }),
      }
    );
    const json = await res.json();
    if (!res.ok) return NextResponse.json(json, { status: res.status });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con DriverApp' }, { status: 503 });
  }
}
