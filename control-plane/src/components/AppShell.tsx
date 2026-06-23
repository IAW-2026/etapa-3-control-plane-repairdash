'use client';
import { ReactNode } from 'react';
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
  const { sidebarOpen } = state;

  return (
    <div
      id="cp"
      style={{
        display: 'flex', width: '100%', height: '100dvh',
        background: 'var(--bg)', color: 'var(--text)',
        fontFamily: 'var(--font-instrument, "Instrument Sans"), sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Mobile sidebar backdrop (shown only under the CSS breakpoint) */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="app-backdrop"
          onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
        />
      )}

      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
        <Header />

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
