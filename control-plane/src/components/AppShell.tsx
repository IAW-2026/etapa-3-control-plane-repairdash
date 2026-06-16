'use client';
import { useEffect, useState, ReactNode } from 'react';
import { StoreProvider, useStore } from '@/lib/store';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { ClienteModal } from '@/features/rider/ClienteModal';
import { WorkerModal } from '@/features/driver/WorkerModal';
import { ServiceModal } from '@/features/driver/ServiceModal';
import { PromoModal } from '@/features/promotions/PromoModal';
import { ReportModal } from '@/features/feedback/ReportModal';
import { ConfirmModal } from './common/ConfirmModal';
import { Toast } from './ui/Toast';

// Persistent chrome shared by every page: sidebar, header, modals and toast.
// Lives inside a layout so it stays mounted across client-side navigations.
// The actual section content is rendered through `children` by each page.
function Chrome({ children }: { children: ReactNode }) {
  const { state, dispatch } = useStore();
  const { theme, sidebarOpen } = state;
  const [winW, setWinW] = useState(() => (
    typeof window === 'undefined' ? 1280 : window.innerWidth
  ));

  useEffect(() => {
    const onR = () => setWinW(window.innerWidth);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);

  const isMobile = winW < 880;

  return (
    <div
      id="cp"
      data-theme={theme}
      style={{
        display: 'flex', width: '100%', height: '100dvh',
        background: 'var(--bg)', color: 'var(--text)',
        fontFamily: 'var(--font-instrument, "Instrument Sans"), sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,6,16,.55)', zIndex: 40 }}
        />
      )}

      <Sidebar isMobile={isMobile} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
        <Header isMobile={isMobile} />

        <main style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px, 3vw, 30px)' }}>
          {children}
        </main>
      </div>

      {/* Modals */}
      <ClienteModal />
      <WorkerModal />
      <ServiceModal />
      <PromoModal />
      <ConfirmModal />
      <ReportModal />

      {/* Toast */}
      <Toast />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <Chrome>{children}</Chrome>
    </StoreProvider>
  );
}
