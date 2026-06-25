'use client';
import { useEffect, useState } from 'react';
import type { ServiceType } from '@/lib/types';

export function useServiceTypes() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    fetch('/api/cp/services?page=1&limit=100', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (!alive) return;
        setServices(Array.isArray(json?.items) ? json.items : []);
      })
      .catch(() => {
        if (alive) setServices([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => { alive = false; };
  }, []);

  return { services, loading };
}
