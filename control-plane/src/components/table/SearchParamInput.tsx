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
      style={style}
    />
  );
}
