import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { ENV, promoHeaders, configured } from '@/lib/server/config';
import { CACHE_TAGS } from '@/lib/server/cache';
import type { Promotion } from '@/lib/types';

function normalizeTipoDescuento(value: unknown): Promotion['tipoDescuento'] {
  return value === '$' || value === 'monto_fijo' ? '$' : '%';
}

function normalize(p: Record<string, unknown>): Promotion {
  return {
    id:            p.id            as number,
    nombre:        (p.nombre        as string)  || '',
    tipoDescuento: normalizeTipoDescuento(p.tipoDescuento),
    valor:         (p.valor         as number)  || 0,
    descripcion:   (p.descripcion   as string)  || '',
    destacada:     !!(p.destacada),
    usoUnico:      !!(p.usoUnico),
    precioMinimo:  (p.precioMinimo  as number | null) ?? null,
    categorias:    (p.categorias    as string[]) || [],
    eliminada:     !!(p.eliminada),
    fechaInicio:   (p.fechaInicio   as string)  || '',
    fechaFin:      (p.fechaFin      as string | null) ?? null,
    filtroUsuarios:(p.filtroUsuarios as Record<string, unknown> | null) ?? null,
  };
}

export async function GET(req: NextRequest) {
  if (!configured(ENV.promociones.base)) {
    return NextResponse.json({ items: [], totalPages: 1, total: 0 });
  }
  try {
    const sp = new URLSearchParams();
    const q        = req.nextUrl.searchParams.get('q')      || '';
    const status   = req.nextUrl.searchParams.get('status') || '';
    const page     = req.nextUrl.searchParams.get('page')   || '1';

    // 'eliminada' status shows deleted; all others show non-deleted
    if (status === 'eliminada') sp.set('eliminada', 'true');
    sp.set('page',  page);
    sp.set('limit', '20');

    const res = await fetch(`${ENV.promociones.base}/api/admin/promociones?${sp}`, {
      headers: promoHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
    const json = await res.json();

    let items: Promotion[] = (json.data || []).map(normalize);

    if (q) {
      const fq = q.toLowerCase();
      items = items.filter(p =>
        `${p.nombre} ${p.descripcion} ${p.categorias.join(' ')}`.toLowerCase().includes(fq)
      );
    }

    // Client-side status filter for non-eliminada statuses (activa, vencida, programada)
    if (status && status !== 'ALL' && status !== 'eliminada') {
      const now = new Date();
      items = items.filter(p => {
        const inicio = new Date(p.fechaInicio);
        const fin    = p.fechaFin ? new Date(p.fechaFin) : null;
        if (status === 'activa')     return !p.eliminada && inicio <= now && (!fin || fin > now);
        if (status === 'programada') return !p.eliminada && inicio > now;
        if (status === 'vencida')    return !p.eliminada && fin != null && fin <= now;
        return true;
      });
    }

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

export async function POST(req: NextRequest) {
  if (!configured(ENV.promociones.base)) {
    return NextResponse.json({ error: 'Promociones no configurado' }, { status: 503 });
  }
  try {
    const body = await req.json();
    const res = await fetch(`${ENV.promociones.base}/api/admin/promociones`, {
      method: 'POST',
      headers: { ...promoHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) return NextResponse.json(json, { status: res.status });
    revalidateTag(CACHE_TAGS.promotions, 'max');
    revalidateTag(CACHE_TAGS.summary, 'max');
    return NextResponse.json({ data: normalize(json) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con Promociones' }, { status: 503 });
  }
}
