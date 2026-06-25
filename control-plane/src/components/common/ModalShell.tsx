import type { CSSProperties, ReactNode } from 'react';

export function ModalShell({
  children,
  width = 'min(460px, 100%)',
  top = false,
  label,
  style,
}: {
  children: ReactNode;
  width?: number | string;
  top?: boolean;
  /** Accessible name announced for the dialog. */
  label?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={top ? 'modal-overlay-top' : 'modal-overlay'}>
      <div
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-label={label}
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
