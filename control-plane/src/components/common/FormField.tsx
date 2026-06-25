import type { ReactNode } from 'react';

export function FormField({
  label,
  children,
  help,
  error,
}: {
  label: ReactNode;
  children: ReactNode;
  help?: ReactNode;
  error?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12.5px] font-semibold text-[var(--text2)]">{label}</label>
      {children}
      {help && <span className="text-[12.5px] text-[var(--text3)]">{help}</span>}
      {error && <span className="text-[12.5px] text-[var(--danger)]">{error}</span>}
    </div>
  );
}
