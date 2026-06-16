'use client';

// Small rotating ring for inline button loading states. Inherits the button's
// text color via `currentColor`, so it works on btn-primary, btn-danger, etc.
// The spin animation lives in globals.css (`.spinner`).
export function Spinner({ size = 15 }: { size?: number }) {
  return (
    <span
      className="spinner"
      aria-label="Cargando"
      style={{ width: size, height: size, display: 'inline-block' }}
    />
  );
}
