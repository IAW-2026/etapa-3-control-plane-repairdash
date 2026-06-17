'use client';
import { useState } from 'react';

export function SearchParamInput({
  initialValue,
  placeholder,
  className,
  style,
  onApply,
}: {
  initialValue: string;
  placeholder: string;
  className?: string;
  style?: React.CSSProperties;
  onApply: (value: string) => void;
}) {
  const [draft, setDraft] = useState(initialValue);
  const apply = () => {
    if (draft.trim() !== initialValue) onApply(draft);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 6 }}>
      <input
        placeholder={placeholder}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={apply}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            apply();
          }
        }}
        className={className}
        style={{ ...style, flex: 1, minWidth: 0 }}
      />
      <button
        type="button"
        className="btn-table"
        style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}
        onClick={apply}
      >
        Buscar
      </button>
    </div>
  );
}
