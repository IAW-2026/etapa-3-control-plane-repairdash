'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { Dashboard } from './views/Dashboard';
import { TableView } from './views/TableView';
import { CommissionView } from './views/CommissionView';
import { FeedbackView } from './views/FeedbackView';
import { ClienteModal } from './modals/ClienteModal';
import { WorkerModal } from './modals/WorkerModal';
import { ServiceModal } from './modals/ServiceModal';
import { PromoModal } from './modals/PromoModal';
import { ConfirmModal } from './modals/ConfirmModal';
import { ReportModal } from './modals/ReportModal';
import { Toast } from './ui/Toast';
import type { Route } from '@/lib/types';

const TABLE_ROUTES: Route[] = ['clientes','workers','pdrivers','priders','jobs','viajes','services','transactions','withdrawals','promotions','historial'];

export function ControlPlane() {
  const { state, dispatch } = useStore();
  const { theme, route, sidebarOpen } = state;
  const [winW, setWinW] = useState(1280);

  useEffect(() => {
    const onR = () => setWinW(window.innerWidth);
    setWinW(window.innerWidth);
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
          {route === 'dashboard' && <Dashboard />}
          {TABLE_ROUTES.includes(route) && <TableView route={route} />}
          {route === 'commission' && <CommissionView />}
          {route === 'feedback' && <FeedbackView />}
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
