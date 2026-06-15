import type { ReactNode } from 'react';
import type { Route } from '@/lib/types';
import type { TableMeta } from '@/components/table/meta';

import { clientesMeta, viajesMeta } from './repairdash/meta';
import { ClientesTable } from './repairdash/ClientesTable';
import { ViajesTable } from './repairdash/ViajesTable';

import { workersMeta, jobsMeta, servicesMeta } from './driver/meta';
import { WorkersTable } from './driver/WorkersTable';
import { JobsTable } from './driver/JobsTable';
import { ServicesTable } from './driver/ServicesTable';

import { pdriversMeta, pridersMeta, transactionsMeta, withdrawalsMeta } from './payments/meta';
import { PDriversTable } from './payments/PDriversTable';
import { PRidersTable } from './payments/PRidersTable';
import { TransactionsTable } from './payments/TransactionsTable';
import { WithdrawalsTable, WithdrawalsFooter } from './payments/WithdrawalsTable';

import { promotionsMeta, historialMeta } from './promotions/meta';
import { PromotionsTable } from './promotions/PromotionsTable';
import { HistorialTable } from './promotions/HistorialTable';

type AnyItem = Record<string, unknown>;

// One entry per table route: its display metadata, the renderer for the
// per-entity <table> (fed the current page of rows by TableShell), and an
// optional footer rendered below the table.
export interface TableEntry {
  meta: TableMeta;
  render: (rows: AnyItem[]) => ReactNode;
  footer?: ReactNode;
}

// `as never` bridges the generic row array from TableShell to each table's
// concrete row type; the dataKey in each meta guarantees the right shape.
export const TABLE_REGISTRY: Partial<Record<Route, TableEntry>> = {
  clientes:     { meta: clientesMeta,     render: rows => <ClientesTable rows={rows as never} /> },
  viajes:       { meta: viajesMeta,       render: rows => <ViajesTable rows={rows as never} /> },
  workers:      { meta: workersMeta,      render: rows => <WorkersTable rows={rows as never} /> },
  jobs:         { meta: jobsMeta,         render: rows => <JobsTable rows={rows as never} /> },
  services:     { meta: servicesMeta,     render: rows => <ServicesTable rows={rows as never} /> },
  pdrivers:     { meta: pdriversMeta,     render: rows => <PDriversTable rows={rows as never} /> },
  priders:      { meta: pridersMeta,      render: rows => <PRidersTable rows={rows as never} /> },
  transactions: { meta: transactionsMeta, render: rows => <TransactionsTable rows={rows as never} /> },
  withdrawals:  { meta: withdrawalsMeta,  render: rows => <WithdrawalsTable rows={rows as never} />, footer: <WithdrawalsFooter /> },
  promotions:   { meta: promotionsMeta,   render: rows => <PromotionsTable rows={rows as never} /> },
  historial:    { meta: historialMeta,    render: rows => <HistorialTable rows={rows as never} /> },
};
