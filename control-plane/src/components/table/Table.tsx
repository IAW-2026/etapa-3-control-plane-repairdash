'use client';
import { type ReactNode } from 'react';

export interface Column {
  label: string;
  // The table is intentionally route-agnostic; each feature owns its row shape.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: (row: any) => ReactNode;
  align?: 'left' | 'right';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Table({ columns, rows }: { columns: Column[]; rows: any[] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i} className={`th${col.align === 'right' ? ' th-right' : ''}`}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className="tr-base">
            {columns.map((col, ci) => (
              <td
                key={ci}
                className="td"
                data-label={col.label || undefined}
                style={{
                  textAlign: col.align || 'left',
                  whiteSpace: col.label === '' && col.align === 'right' ? 'nowrap' : undefined,
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: col.label === '' && col.align === 'right' ? 'row' : 'column',
                  alignItems: col.align === 'right' ? 'flex-end' : 'flex-start',
                  justifyContent: col.label === '' && col.align === 'right' ? 'flex-end' : undefined,
                  gap: col.label === '' && col.align === 'right' ? 8 : undefined,
                }}>
                  {col.render(row)}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
