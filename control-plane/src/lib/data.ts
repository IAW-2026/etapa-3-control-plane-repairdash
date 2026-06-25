import type { AppData } from './types';

// Empty initial state. All data is loaded from the real upstream APIs
// through the /api/cp/* routes — there is no mocked/seed data.
export function emptyData(): AppData {
  return {
    clientes: [],
    viajes: [],
    workers: [],
    jobs: [],
    serviceTypes: [],
    transactions: [],
    withdrawals: [],
    pdrivers: [],
    priders: [],
    commission: { rate: '—', updatedAt: '' },
    reports: [],
    promotions: [],
    promoHistory: [],
  };
}
