import { SectionCard } from '@/components/common/SectionCard';
import { Pagination } from '@/components/table/Pagination';
import { Table } from '@/components/table/Table';
import type { Report } from '@/lib/types';
import { buildReportColumns } from './report-columns';

export function FeedbackReportsTable({
  rows,
  total,
  totalPages,
  page,
  onOpenReport,
}: {
  rows: Report[];
  total: number;
  totalPages: number;
  page: number;
  onOpenReport: (id: string) => void;
}) {
  return (
    <SectionCard style={{ padding: 0, overflow: 'hidden' }}>
      <div className="table-wrap" style={{ overflowX: 'auto' }}>
        <Table columns={buildReportColumns(onOpenReport)} rows={rows} />
      </div>
      {rows.length === 0 && (
        <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>Sin reportes para los filtros aplicados.</div>
      )}
      <Pagination page={page} totalPages={totalPages} total={total} />
    </SectionCard>
  );
}
