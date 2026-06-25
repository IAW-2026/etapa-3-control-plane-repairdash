import type { CSSProperties, ReactNode } from 'react';

export function SectionCard({
  children,
  className = 'card',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
