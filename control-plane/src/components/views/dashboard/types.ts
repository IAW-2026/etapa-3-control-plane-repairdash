import type { Route, SummaryData } from '@/lib/types';

export type DashboardNavigate = (route: Route) => void;

export type DashboardStat = {
  val: string | number;
  label: string;
  color?: string;
};

export type DashboardLink = {
  label: string;
  color: string;
  go: () => void;
};

export type AppCard = {
  name: string;
  dot: string;
  stats: DashboardStat[];
  links: DashboardLink[];
};

export type TransactionBar = {
  label: string;
  count: number;
  w: number;
};

export type DashboardModel = {
  appCards: AppCard[];
  txBars: TransactionBar[];
  sumWdRequested: number | null;
  commissionRate: SummaryData['payments']['commission'] extends infer C
    ? C extends { commissionRate: infer R }
      ? R | null
      : string | null
    : string | null;
  commissionUpdated: string;
};
