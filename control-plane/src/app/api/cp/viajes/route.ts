import { NextRequest, NextResponse } from 'next/server';
import { ENV, rdHeaders, configured } from '@/lib/server/config';
import type { Viaje } from '@/lib/types';

const PAGE_SIZE = 20;

function normalize(v: Record<string, unknown>): Viaje {
  const pagos = (v.pagos as Record<string, unknown>[] | undefined) || [];
  const pago = pagos[0];
  return {
    id_viaje: v.id_viaje as number,
    id_clerk: v.id_clerk as string,
    cliente: v.cliente
      ? `${(v.cliente as Record<string, unknown>).nombre} ${(v.cliente as Record<string, unknown>).apellido}`.trim()
      : (v.id_clerk as string),
    tipo:   (v.tipo_de_trabajo as string) || '—',
    estado: (v.estado as string) || '—',
    driver: (v.driver as string) || '—',
    fecha:  (v.fecha as string) || '',
    pago: {
      monto:  pago ? String(pago.monto) : '0',
      estado: pago ? (pago.estado as string) : 'sin_pago',
    },
  };
}

export async function GET(req: NextRequest) {
  if (!configured(ENV.repairdash.base)) {
    return NextResponse.json({ items: [], totalPages: 1, total: 0 });
  }
  try {
    const res = await fetch(`${ENV.repairdash.base}/api/super-admin/viajes`, {
      headers: rdHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
    const json = await res.json();

    let items: Viaje[] = (json.data || []).map(normalize);

    const q = req.nextUrl.searchParams.get('q')?.toLowerCase() || '';
    const st = req.nextUrl.searchParams.get('status') || '';
    const from = req.nextUrl.searchParams.get('from') || '';
    const to   = req.nextUrl.searchParams.get('to')   || '';

    if (q)  items = items.filter(v => `${v.id_viaje} ${v.cliente} ${v.driver} ${v.tipo}`.toLowerCase().includes(q));
    if (st) items = items.filter(v => v.estado === st);
    if (from) items = items.filter(v => v.fecha.slice(0, 10) >= from);
    if (to)   items = items.filter(v => v.fecha.slice(0, 10) <= to);

    const page = Math.max(1, parseInt(req.nextUrl.searchParams.get('page') || '1'));
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const sliced = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return NextResponse.json({ items: sliced, totalPages, total });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con RepairDash' }, { status: 503 });
  }
}
