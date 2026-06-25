import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { ENV, fbHeaders, actor, configured } from '@/lib/server/config';
import { CACHE_TAGS } from '@/lib/server/cache';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!configured(ENV.feedback.base)) {
    return NextResponse.json({ error: 'Feedback no configurado' }, { status: 503 });
  }
  try {
    const { decision } = await req.json();
    const res = await fetch(
      `${ENV.feedback.base}/api/control-plane/reports/${encodeURIComponent(id)}/resolve`,
      {
        method: 'PATCH',
        headers: { ...fbHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          ...actor(),
          reason: `Resolución de disputa (${decision}) desde Control Plane`,
        }),
      }
    );
    const json = await res.json();
    if (!res.ok) return NextResponse.json(json, { status: res.status });
    revalidateTag(CACHE_TAGS.feedback, 'max');
    revalidateTag(CACHE_TAGS.summary, 'max');
    return NextResponse.json({ data: json });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con Feedback' }, { status: 503 });
  }
}
