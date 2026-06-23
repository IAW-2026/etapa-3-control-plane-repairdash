'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Prueba } from '@/lib/types';

export function ReportEvidenceList({ pruebas }: { pruebas: Prueba[] }) {
  const [selected, setSelected] = useState<Prueba | null>(null);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setSelected(null);
  }, []);

  useEffect(() => {
    if (selected) {
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }
  }, [selected, onKeyDown]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)' }}>Pruebas adjuntas</span>
      {pruebas.length > 0 ? (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {pruebas.map(prueba => (
            <div key={prueba.id} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 8, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)' }}>
              {prueba.tipo === 'video' ? (
                <video src={prueba.url} controls style={{ width: 180, height: 120, borderRadius: 7, objectFit: 'cover', background: '#000', cursor: 'default' }} />
              ) : (
                <img
                  src={prueba.url}
                  alt="Evidencia"
                  onClick={() => setSelected(prueba)}
                  style={{ width: 180, height: 120, borderRadius: 7, objectFit: 'cover', background: 'var(--bg)', cursor: 'pointer' }}
                />
              )}
              <span style={{ fontSize: 11.5, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: prueba.tipo === 'video' ? 'var(--violet)' : 'var(--pink)' }} />
                {prueba.tipo === 'video' ? 'Video' : 'Imagen'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>Sin pruebas adjuntas.</span>
      )}

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,.72)', backdropFilter: 'blur(4px)',
          }}
        >
          {selected.tipo === 'video' ? (
            <video src={selected.url} controls autoPlay style={{ maxWidth: '92vw', maxHeight: '92vh', borderRadius: 10 }} />
          ) : (
            <img src={selected.url} alt="Evidencia" style={{ maxWidth: '92vw', maxHeight: '92vh', borderRadius: 10, boxShadow: '0 8px 40px rgba(0,0,0,.5)' }} />
          )}
        </div>
      )}
    </div>
  );
}
