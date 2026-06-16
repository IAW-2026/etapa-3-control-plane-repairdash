import type { AppData } from '@/lib/types';

// Display + behaviour metadata for a table section. Each feature provides one
// of these per route (see features/<domain>/meta.ts). `dataKey` points at the
// AppData slice that holds the current (server-paginated) page of rows.
export interface TableMeta {
  group: string;
  title: string;
  app?: string;
  tone?: string;
  endpoint?: string;
  sub?: string;
  search?: string;
  statuses?: string[];
  dates?: boolean;
  create?: boolean;
  createLabel?: string;
  // Column count for the loading skeleton; defaults to 5 in TableShell.
  skeletonCols?: number;
  dataKey: keyof AppData;
}

export const TONE_COLORS: Record<string, [string, string]> = {
  pink:   ['var(--pink-soft)',   'var(--pink)'],
  violet: ['var(--violet-soft)', 'var(--violet)'],
  mag:    ['var(--mag-soft)',    'var(--mag)'],
};
