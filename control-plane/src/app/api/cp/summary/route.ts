import { NextResponse } from 'next/server';
import { ENV, rdHeaders, drHeaders, pmHeaders, fbHeaders, promoHeaders, configured } from '@/lib/server/config';

async function safeFetch(url: string, headers: Record<string, string>) {
  try {
    const res = await fetch(url, { headers, cache: 'no-store', redirect: 'manual' });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return null; // e.g. a login HTML page
    return await res.json();
  } catch {
    return null;
  }
}

export async function GET() {
  const [rdClientes, rdViajes, drSum, pmSum, fbSum, promoList, promoHist] = await Promise.all([
    configured(ENV.repairdash.base)
      ? safeFetch(`${ENV.repairdash.base}/api/super-admin/clientes/count`, rdHeaders())
      : null,
    configured(ENV.repairdash.base)
      ? safeFetch(`${ENV.repairdash.base}/api/super-admin/viajes/count`, rdHeaders())
      : null,
    configured(ENV.driver.base)
      ? safeFetch(`${ENV.driver.base}/api/control-plane/summary`, drHeaders())
      : null,
    configured(ENV.payments.base)
      ? safeFetch(`${ENV.payments.base}/api/control-plane/summary`, pmHeaders())
      : null,
    configured(ENV.feedback.base)
      ? safeFetch(`${ENV.feedback.base}/api/control-plane/summary`, fbHeaders())
      : null,
    configured(ENV.promociones.base)
      ? safeFetch(`${ENV.promociones.base}/api/admin/promociones?page=1&limit=1`, promoHeaders())
      : null,
    configured(ENV.promociones.base)
      ? safeFetch(`${ENV.promociones.base}/api/historial?page=1&limit=1`, promoHeaders())
      : null,
  ]);

  const pmData = pmSum || {};
  const drData = (drSum?.data) || {};
  const fbData = fbSum || {};

  const promoTotal = (promoList?.pagination?.total as number) ?? (promoList?.total as number) ?? null;
  const promoUsos  = (promoHist?.pagination?.total as number) ?? (promoHist?.total as number) ?? null;

  return NextResponse.json({
    repairdash: {
      clientes: (rdClientes?.data?.total as number) ?? null,
      viajes:   (rdViajes?.data?.total   as number) ?? null,
    },
    driver: {
      workers:            drData.workers     || null,
      jobs:               drData.jobs        || null,
      serviceTypes:       drData.serviceTypes|| null,
    },
    payments: {
      commission:         pmData.commission          || null,
      transactionsByStatus: pmData.transactionsByStatus || null,
      withdrawalsByStatus:  pmData.withdrawalsByStatus  || null,
      users:              pmData.users               || null,
    },
    feedback: {
      reportesAbiertos:   (fbData.reportesAbiertos   as number) ?? null,
      reportesEnRevision: (fbData.reportesEnRevision as number) ?? null,
      reportesResueltos:  (fbData.reportesResueltos  as number) ?? null,
      reviewsPendientes:  (fbData.reviewsPendientes  as number) ?? null,
    },
    promociones: {
      total: promoTotal,
      usos:  promoUsos,
    },
  });
}
