import { NextRequest, NextResponse } from 'next/server';
import { ENV, promoHeaders, configured } from '@/lib/server/config';
import type { Promotion } from '@/lib/types';

function normalize(p: Record<string, unknown>): Promotion {
  return {
    id:            p.id            as number,
    nombre:        (p.nombre        as string)  || '',
    tipoDescuento: (p.tipoDescuento as Promotion['tipoDescuento']) || 'porcentaje',
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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!configured(ENV.promociones.base)) {
    return NextResponse.json({ error: 'Promociones no configurado' }, { status: 503 });
  }
  try {
    const body = await req.json();
    const res = await fetch(`${ENV.promociones.base}/api/admin/promociones/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { ...promoHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) return NextResponse.json(json, { status: res.status });
    return NextResponse.json({ data: normalize(json.data || json) });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con Promociones' }, { status: 503 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!configured(ENV.promociones.base)) {
    return NextResponse.json({ error: 'Promociones no configurado' }, { status: 503 });
  }
  try {
    const res = await fetch(`${ENV.promociones.base}/api/admin/promociones/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: promoHeaders(),
    });
    const json = await res.json();
    if (!res.ok) return NextResponse.json(json, { status: res.status });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con Promociones' }, { status: 503 });
  }
}
