import type { CSSProperties, ReactNode } from 'react';

export function ModalShell({
  children,
  width = 'min(460px, 100%)',
  top = false,
  style,
}: {
  children: ReactNode;
  width?: number | string;
  top?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={top ? 'modal-overlay-top' : 'modal-overlay'}>
      <div
        className="modal-box"
        style={{
          width,
          gap: 14,
          ...(top ? { margin: 'auto' } : {}),
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}
