'use client';

interface BadgeProps {
  label: string;
  bg: string;
  fg: string;
  className?: string;
}

export function Badge({ label, bg, fg, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-bold ${className}`}
      style={{ background: bg, color: fg }}
    >
      {label}
    </span>
  );
}
