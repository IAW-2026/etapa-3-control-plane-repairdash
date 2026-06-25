import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { ENV, drHeaders, actor, configured } from '@/lib/server/config';
import { CACHE_TAGS } from '@/lib/server/cache';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!configured(ENV.driver.base)) {
    return NextResponse.json({ error: 'DriverApp no configurado' }, { status: 503 });
  }
  try {
    const { status } = await req.json();
    const res = await fetch(
      `${ENV.driver.base}/api/control-plane/workers/${encodeURIComponent(id)}/status`,
      {
        method: 'PATCH',
        headers: { ...drHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          ...actor(),
          reason: `Cambio de estado operativo a ${status} desde Control Plane`,
        }),
      }
    );
    const json = await res.json();
    if (!res.ok) return NextResponse.json(json, { status: res.status });
    revalidateTag(CACHE_TAGS.driver, 'max');
    revalidateTag(CACHE_TAGS.summary, 'max');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con DriverApp' }, { status: 503 });
  }
}
