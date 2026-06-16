import { NextRequest, NextResponse } from 'next/server';
import { ENV, promoHeaders, configured } from '@/lib/server/config';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/server/cache';
import type { PromoHistory } from '@/lib/types';

function normalize(h: Record<string, unknown>): PromoHistory {
  return {
    id:           h.id           as number,
    fechaUso:     (h.fechaUso    as string) || '',
    nombre:       (h.nombre      as string) || '',
    promocionId:  h.promocionId  as number,
    usuario:      (h.usuarioId   as string) || '',
    usuarioId:    (h.usuarioId   as string) || '',
    trabajoId:    h.trabajoId    as number,
    valorOriginal:(h.valorOriginal as number) || 0,
    valorPagado:  (h.valorPagado  as number) || 0,
  };
}

export async function GET(req: NextRequest) {
  if (!configured(ENV.promociones.base)) {
    return NextResponse.json({ items: [], totalPages: 1, total: 0 });
  }
  try {
    const sp = new URLSearchParams();
    const q    = req.nextUrl.searchParams.get('q')    || '';
    const from = req.nextUrl.searchParams.get('from') || '';
    const to   = req.nextUrl.searchParams.get('to')   || '';
    const page = req.nextUrl.searchParams.get('page') || '1';
    sp.set('page',  page);
    sp.set('limit', '20');

    const res = await fetch(`${ENV.promociones.base}/api/historial?${sp}`, {
      headers: promoHeaders(),
      next: { revalidate: CACHE_TTL.promoHistory, tags: [CACHE_TAGS.promotions] },
    });
    if (!res.ok) return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
    const json = await res.json();

    let items: PromoHistory[] = (json.data || []).map(normalize);

    if (q) {
      const fq = q.toLowerCase();
      items = items.filter(h =>
        `${h.nombre} ${h.usuario} ${h.trabajoId}`.toLowerCase().includes(fq)
      );
    }
    if (from) items = items.filter(h => h.fechaUso.slice(0, 10) >= from);
    if (to)   items = items.filter(h => h.fechaUso.slice(0, 10) <= to);

    const pag = json.pagination || {};
    return NextResponse.json({
      items,
      totalPages: pag.totalPages || Math.max(1, Math.ceil(items.length / 20)),
      total:      pag.total      || items.length,
    });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con Promociones' }, { status: 503 });
  }
}
