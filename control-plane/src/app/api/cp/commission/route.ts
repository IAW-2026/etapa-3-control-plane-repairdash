import { NextRequest, NextResponse } from 'next/server';
import { ENV, pmHeaders, actor, configured } from '@/lib/server/config';

export async function GET() {
  if (!configured(ENV.payments.base)) {
    return NextResponse.json({ data: null });
  }
  try {
    const res = await fetch(`${ENV.payments.base}/api/control-plane/summary`, {
      headers: pmHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
    const json = await res.json();
    const c = json.commission || {};
    return NextResponse.json({
      data: {
        rate:      (c.commissionRate as string) || '0.00',
        updatedAt: (c.updatedAt      as string) || new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con Payments' }, { status: 503 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!configured(ENV.payments.base)) {
    return NextResponse.json({ error: 'Payments no configurado' }, { status: 503 });
  }
  try {
    const { commissionRate, reason } = await req.json();
    const res = await fetch(`${ENV.payments.base}/api/control-plane/commission`, {
      method: 'PATCH',
      headers: { ...pmHeaders(), 'content-type': 'application/json' },
      body: JSON.stringify({
        commissionRate,
        ...actor(),
        reason: reason || 'Actualización de comisión desde Control Plane',
      }),
    });
    const json = await res.json();
    if (!res.ok) return NextResponse.json(json, { status: res.status });
    const c = json.commission || {};
    return NextResponse.json({
      data: {
        rate:      (c.commissionRate as string) || commissionRate,
        updatedAt: (c.updatedAt      as string) || new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con Payments' }, { status: 503 });
  }
}
