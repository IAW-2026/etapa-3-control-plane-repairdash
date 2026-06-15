import { NextRequest, NextResponse } from 'next/server';
import { ENV, rdHeaders, configured } from '@/lib/server/config';
import type { Cliente } from '@/lib/types';

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  if (!configured(ENV.repairdash.base)) {
    return NextResponse.json({ items: [], totalPages: 1, total: 0 });
  }
  try {
    const res = await fetch(`${ENV.repairdash.base}/api/super-admin/clientes`, {
      headers: rdHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
    const json = await res.json();

    let items: Cliente[] = (json.data || []).map((c: Record<string, unknown>) => ({
      id_clerk:     c.id_clerk,
      nombre:       c.nombre,
      apellido:     c.apellido,
      mail:         c.mail,
      calificacion: c.calificacion ?? null,
    }));

    const q = req.nextUrl.searchParams.get('q')?.toLowerCase() || '';
    if (q) {
      items = items.filter(c =>
        `${c.nombre} ${c.apellido} ${c.mail} ${c.id_clerk}`.toLowerCase().includes(q)
      );
    }

    const page = Math.max(1, parseInt(req.nextUrl.searchParams.get('page') || '1'));
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const sliced = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return NextResponse.json({ items: sliced, totalPages, total });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con RepairDash' }, { status: 503 });
  }
}
