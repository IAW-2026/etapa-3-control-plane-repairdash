import { NextRequest, NextResponse } from 'next/server';
import { ENV, rdHeaders, configured } from '@/lib/server/config';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!configured(ENV.repairdash.base)) {
    return NextResponse.json({ error: 'RepairDash no configurado' }, { status: 503 });
  }
  try {
    const body = await req.json();
    const res = await fetch(`${ENV.repairdash.base}/api/super-admin/clientes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { ...rdHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) return NextResponse.json(json, { status: res.status });
    return NextResponse.json({ data: json.data });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con RepairDash' }, { status: 503 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!configured(ENV.repairdash.base)) {
    return NextResponse.json({ error: 'RepairDash no configurado' }, { status: 503 });
  }
  try {
    const res = await fetch(`${ENV.repairdash.base}/api/super-admin/clientes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: rdHeaders(),
    });
    const json = await res.json();
    if (!res.ok) return NextResponse.json(json, { status: res.status });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con RepairDash' }, { status: 503 });
  }
}
