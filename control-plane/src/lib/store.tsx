'use client';
import { createContext, useCallback, useContext, useEffect, useReducer, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { emptyData } from './data';
import type { AppData, Commission, FormState, ModalType, Report, Route, ServiceType, SummaryData, Theme, Toast } from './types';

interface State {
  theme: Theme;
  route: Route;
  sidebarOpen: boolean;
  modal: ModalType | null;
  form: FormState;
  formError: string;
  commissionInput: string;
  commissionError: string;
  toast: Toast | null;
  data: AppData;
  summary: SummaryData | null;
  summaryLoading: boolean;
  reportDetail: Report | null;
  reportLoading: boolean;
  saving: boolean;
}

type Action =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_ROUTE'; payload: Route }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'CLOSE_SIDEBAR' }
  | { type: 'SET_MODAL'; payload: ModalType | null }
  | { type: 'SET_MODAL_DECISION'; payload: 'AFavor' | 'EnContra' }
  | { type: 'SET_MODAL_WORKER_STATUS'; payload: 'ONLINE' | 'OFFLINE' | 'EN_TRABAJO' }
  | { type: 'SET_FORM'; payload: FormState }
  | { type: 'SET_FORM_FIELD'; payload: { key: keyof FormState; value: FormState[keyof FormState] } }
  | { type: 'SET_FORM_ERROR'; payload: string }
  | { type: 'SET_COMMISSION_INPUT'; payload: string }
  | { type: 'SET_COMMISSION_ERROR'; payload: string }
  | { type: 'SET_TOAST'; payload: Toast | null }
  | { type: 'SET_DATA'; payload: AppData }
  | { type: 'UPDATE_DATA'; payload: Partial<AppData> }
  | { type: 'SET_SUMMARY'; payload: SummaryData | null }
  | { type: 'SET_SUMMARY_LOADING'; payload: boolean }
  | { type: 'SET_REPORT_DETAIL'; payload: Report | null }
  | { type: 'SET_REPORT_LOADING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_THEME': return { ...state, theme: action.payload };
    case 'SET_ROUTE': return { ...state, route: action.payload, sidebarOpen: false };
    case 'TOGGLE_SIDEBAR': return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'CLOSE_SIDEBAR': return { ...state, sidebarOpen: false };
    case 'SET_MODAL': return { ...state, modal: action.payload, formError: '' };
    case 'SET_MODAL_DECISION':
      if (!state.modal || state.modal.type !== 'report') return state;
      return { ...state, modal: { ...state.modal, decision: action.payload } };
    case 'SET_MODAL_WORKER_STATUS':
      if (!state.modal || state.modal.type !== 'worker') return state;
      return { ...state, modal: { ...state.modal, status: action.payload } };
    case 'SET_FORM': return { ...state, form: action.payload };
    case 'SET_FORM_FIELD': return { ...state, form: { ...state.form, [action.payload.key]: action.payload.value } };
    case 'SET_FORM_ERROR': return { ...state, formError: action.payload };
    case 'SET_COMMISSION_INPUT': return { ...state, commissionInput: action.payload, commissionError: '' };
    case 'SET_COMMISSION_ERROR': return { ...state, commissionError: action.payload };
    case 'SET_TOAST': return { ...state, toast: action.payload };
    case 'SET_DATA': return { ...state, data: action.payload };
    case 'UPDATE_DATA': return { ...state, data: { ...state.data, ...action.payload } };
    case 'SET_SUMMARY': return { ...state, summary: action.payload };
    case 'SET_SUMMARY_LOADING': return { ...state, summaryLoading: action.payload };
    case 'SET_REPORT_DETAIL': return { ...state, reportDetail: action.payload };
    case 'SET_REPORT_LOADING': return { ...state, reportLoading: action.payload };
    case 'SET_SAVING': return { ...state, saving: action.payload };
    default: return state;
  }
}

function getInitialState(): State {
  // Always start from the same defaults on server and client to avoid hydration
  // mismatches. Persisted theme/route are applied in an effect after mount.
  const theme: Theme = 'dark';
  const route: Route = 'dashboard';
  return {
    theme, route,
    sidebarOpen: false, modal: null, form: {}, formError: '',
    commissionInput: '', commissionError: '', toast: null,
    data: emptyData(),
    summary: null, summaryLoading: false,
    reportDetail: null, reportLoading: false,
    saving: false,
  };
}

// Human-readable labels for worker statuses, used in success toasts.
const WORKER_STATUS_LABEL: Record<'ONLINE' | 'OFFLINE' | 'EN_TRABAJO', string> = {
  ONLINE: 'En línea',
  OFFLINE: 'Desconectado',
  EN_TRABAJO: 'En trabajo',
};

interface StoreCtx {
  state: State;
  dispatch: React.Dispatch<Action>;
  setTheme: (t: Theme) => void;
  showToast: (msg: string, kind?: 'success' | 'error') => void;
  closeModal: () => void;
  fetchSummary: () => Promise<void>;
  fetchCommission: () => Promise<void>;
  fetchReportDetail: (id: string) => Promise<void>;
  saveCliente: () => Promise<void>;
  saveWorker: () => Promise<void>;
  saveService: () => Promise<void>;
  saveCommission: () => Promise<void>;
  savePromo: () => Promise<void>;
  saveResolve: () => Promise<void>;
  deleteCliente: (id: string, name: string) => Promise<void>;
  deleteService: (id: string, name: string) => Promise<void>;
  deletePromo: (id: number, name: string) => Promise<void>;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setTheme = useCallback((t: Theme) => {
    dispatch({ type: 'SET_THEME', payload: t });
    try { localStorage.setItem('cp-theme', t); } catch { /* */ }
  }, []);

  const showToast = useCallback((msg: string, kind: 'success' | 'error' = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    dispatch({ type: 'SET_TOAST', payload: { msg, kind } });
    toastTimer.current = setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 4000);
  }, []);

  const closeModal = useCallback(() => dispatch({ type: 'SET_MODAL', payload: null }), []);

  // ─── Data fetching ────────────────────────────────────────────────────────
  const fetchSummary = useCallback(async () => {
    dispatch({ type: 'SET_SUMMARY_LOADING', payload: true });
    try {
      const res = await fetch('/api/cp/summary', { cache: 'no-store' });
      if (!res.ok) return;
      const json: SummaryData = await res.json();
      dispatch({ type: 'SET_SUMMARY', payload: json });
      // Keep the commission card in sync with the consolidated summary
      const c = json.payments?.commission;
      if (c?.commissionRate) {
        dispatch({ type: 'UPDATE_DATA', payload: { commission: { rate: c.commissionRate, updatedAt: c.updatedAt } } });
      }
    } catch {
      // leave summary as-is on error
    } finally {
      dispatch({ type: 'SET_SUMMARY_LOADING', payload: false });
    }
  }, []);

  const fetchCommission = useCallback(async () => {
    try {
      const res = await fetch('/api/cp/commission', { cache: 'no-store' });
      if (!res.ok) return;
      const json = await res.json();
      if (json.data?.rate) {
        dispatch({ type: 'UPDATE_DATA', payload: { commission: { rate: json.data.rate, updatedAt: json.data.updatedAt } } });
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchReportDetail = useCallback(async (id: string) => {
    dispatch({ type: 'SET_REPORT_DETAIL', payload: null });
    dispatch({ type: 'SET_REPORT_LOADING', payload: true });
    try {
      const res = await fetch(`/api/cp/reports/${encodeURIComponent(id)}`, { cache: 'no-store' });
      if (!res.ok) return;
      const json = await res.json();
      if (json.data) dispatch({ type: 'SET_REPORT_DETAIL', payload: json.data });
    } catch {
      // leave detail null on error
    } finally {
      dispatch({ type: 'SET_REPORT_LOADING', payload: false });
    }
  }, []);

  // After a successful mutation, refresh the current server page. This keeps
  // the same URL, including search-param filters and pagination.
  const refreshCurrentRoute = useCallback((withSummary = false) => {
    router.refresh();
    if (withSummary) fetchSummary();
  }, [router, fetchSummary]);

  // ─── Mutations ────────────────────────────────────────────────────────────
  // Critical admin mutations only touch local state AFTER a 2xx response, then
  // revalidate against the server. A network error or non-2xx response shows a
  // toast and leaves the UI unchanged (no optimistic updates).
  const saveCliente = useCallback(async () => {
    const { form, modal, data } = state;
    if (modal?.type !== 'cliente') return;
    const nombre   = String(form.nombre   || '').trim();
    const apellido = String(form.apellido || '').trim();
    if (!nombre && !apellido) {
      dispatch({ type: 'SET_FORM_ERROR', payload: 'Ingresá al menos un nombre o un apellido.' });
      return;
    }
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      const res = await fetch(`/api/cp/clientes/${encodeURIComponent(modal.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre || undefined, apellido: apellido || undefined }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        dispatch({ type: 'SET_FORM_ERROR', payload: err.message || err.error || 'No se pudo guardar el cambio.' });
        return;
      }
      const json = await res.json();
      const updated = json.data;
      dispatch({ type: 'UPDATE_DATA', payload: {
        clientes: data.clientes.map(c => c.id_clerk === modal.id ? (updated || { ...c, nombre: nombre || c.nombre, apellido: apellido || c.apellido }) : c)
      }});
      dispatch({ type: 'SET_MODAL', payload: null });
      showToast(`Se editó el cliente ${[nombre, apellido].filter(Boolean).join(' ')}`);
      refreshCurrentRoute();
    } catch {
      dispatch({ type: 'SET_FORM_ERROR', payload: 'Error de red — no se aplicó el cambio.' });
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state, showToast, refreshCurrentRoute]);

  const saveWorker = useCallback(async () => {
    const { modal, data } = state;
    if (modal?.type !== 'worker') return;
    const name = modal.name;
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      let res: Response;
      try {
        res = await fetch(`/api/cp/workers/${encodeURIComponent(modal.id)}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: modal.status }),
        });
      } catch {
        showToast(`No se pudo cambiar el estado de ${name}. Probá de nuevo.`, 'error');
        return;
      }
      if (!res.ok) {
        showToast(`No se pudo cambiar el estado de ${name}. Probá de nuevo.`, 'error');
        return;
      }
      dispatch({ type: 'UPDATE_DATA', payload: {
        workers: data.workers.map(w => w.id === modal.id ? { ...w, status: modal.status } : w)
      }});
      dispatch({ type: 'SET_MODAL', payload: null });
      showToast(`Se actualizó el estado de ${name} a ${WORKER_STATUS_LABEL[modal.status]}`);
      refreshCurrentRoute();
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state, showToast, refreshCurrentRoute]);

  const saveService = useCallback(async () => {
    const { form, modal, data } = state;
    if (modal?.type !== 'service') return;
    const nombre   = String(form.nombre || '').trim();
    const precio   = parseFloat(String(form.precio));
    if (!nombre) { dispatch({ type: 'SET_FORM_ERROR', payload: 'El nombre es obligatorio.' }); return; }
    if (!(precio > 0)) { dispatch({ type: 'SET_FORM_ERROR', payload: 'El precio base debe ser mayor a 0.' }); return; }
    const body = { nombre, descripcion: String(form.descripcion || '').trim(), precioBase: precio };

    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      if (modal.id) {
        const res = await fetch(`/api/cp/services/${encodeURIComponent(modal.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          if (res.status === 409) { dispatch({ type: 'SET_FORM_ERROR', payload: 'Conflicto: el nombre ya existe.' }); return; }
          dispatch({ type: 'SET_FORM_ERROR', payload: err.message || err.error || 'No se pudo guardar el cambio.' });
          return;
        }
        const json = await res.json();
        const updated: ServiceType = json.data || { ...data.serviceTypes.find(t => t.id === modal.id)!, ...body };
        dispatch({ type: 'UPDATE_DATA', payload: { serviceTypes: data.serviceTypes.map(t => t.id === modal.id ? updated : t) }});
        dispatch({ type: 'SET_MODAL', payload: null });
        showToast(`Se editó el tipo de servicio ${nombre}`);
        refreshCurrentRoute();
      } else {
        const res = await fetch('/api/cp/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          if (res.status === 409) { dispatch({ type: 'SET_FORM_ERROR', payload: 'Ya existe un tipo de servicio con ese nombre.' }); return; }
          dispatch({ type: 'SET_FORM_ERROR', payload: err.message || err.error || 'No se pudo crear el tipo de servicio.' });
          return;
        }
        const json = await res.json();
        const nuevo: ServiceType = json.data || { id: 'tmp_' + Date.now(), ...body, drivers: 0, activos: 0 };
        dispatch({ type: 'UPDATE_DATA', payload: { serviceTypes: [nuevo, ...data.serviceTypes] }});
        dispatch({ type: 'SET_MODAL', payload: null });
        showToast(`Se creó el tipo de servicio ${nombre}`);
        refreshCurrentRoute();
      }
    } catch {
      dispatch({ type: 'SET_FORM_ERROR', payload: 'Error de red. Verificá la conexión.' });
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state, showToast, refreshCurrentRoute]);

  const saveCommission = useCallback(async () => {
    const v = state.commissionInput.trim();
    if (!/^\d{1,3}(\.\d{1,2})?$/.test(v) || parseFloat(v) > 100) {
      dispatch({ type: 'SET_COMMISSION_ERROR', payload: 'Valor inválido: decimal entre 0 y 100, hasta 2 decimales.' });
      return;
    }
    const rate = parseFloat(v).toFixed(2);
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      let res: Response;
      try {
        res = await fetch('/api/cp/commission', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commissionRate: rate }),
        });
      } catch {
        dispatch({ type: 'SET_COMMISSION_ERROR', payload: 'Error de red — la comisión no se actualizó.' });
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        dispatch({ type: 'SET_COMMISSION_ERROR', payload: err.message || err.error || 'No se pudo actualizar la comisión.' });
        return;
      }
      const json = await res.json();
      const commission: Commission = json.data || { rate, updatedAt: new Date().toISOString() };
      dispatch({ type: 'UPDATE_DATA', payload: { commission } });
      dispatch({ type: 'SET_COMMISSION_INPUT', payload: '' });
      showToast(`Se actualizó la comisión a ${rate}%`);
      fetchCommission();
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state, showToast, fetchCommission]);

  const savePromo = useCallback(async () => {
    const { form, modal, data } = state;
    if (modal?.type !== 'promo') return;
    const nombre = String(form.nombre || '').trim();
    const valor  = parseFloat(String(form.valor));
    if (!nombre) { dispatch({ type: 'SET_FORM_ERROR', payload: 'El nombre es obligatorio.' }); return; }
    if (!(valor > 0)) { dispatch({ type: 'SET_FORM_ERROR', payload: 'El valor debe ser mayor a 0.' }); return; }
    if (form.tipoDescuento === '%' && valor > 100) { dispatch({ type: 'SET_FORM_ERROR', payload: 'Un descuento porcentual no puede superar el 100%.' }); return; }
    if (!form.fechaInicio) { dispatch({ type: 'SET_FORM_ERROR', payload: 'La fecha de inicio es obligatoria.' }); return; }
    if (form.fechaFin && form.fechaFin < (form.fechaInicio || '')) { dispatch({ type: 'SET_FORM_ERROR', payload: 'La fecha de fin no puede ser anterior al inicio.' }); return; }

    const toIso = (d: string | undefined, end: boolean) => d ? new Date(d + (end ? 'T23:59:59' : 'T00:00:00')).toISOString() : null;
    const payload = {
      nombre,
      descripcion:   String(form.descripcion || '').trim(),
      tipoDescuento: form.tipoDescuento || '%',
      valor,
      categorias:    form.categorias || [],
      precioMinimo:  (form.precioMinimo === '' || form.precioMinimo == null) ? null : parseFloat(String(form.precioMinimo)),
      destacada:     !!form.destacada,
      usoUnico:      !!form.usoUnico,
      fechaInicio:   toIso(form.fechaInicio, false) || new Date().toISOString(),
      fechaFin:      toIso(form.fechaFin, true),
    };

    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      if (modal.id !== null) {
        const res = await fetch(`/api/cp/promotions/${encodeURIComponent(String(modal.id))}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          dispatch({ type: 'SET_FORM_ERROR', payload: err.error || 'No se pudo guardar el cambio.' });
          return;
        }
        const json = await res.json();
        const updated = json.data || { ...data.promotions.find(p => p.id === modal.id)!, ...payload };
        dispatch({ type: 'UPDATE_DATA', payload: { promotions: data.promotions.map(p => p.id === modal.id ? updated : p) }});
        dispatch({ type: 'SET_MODAL', payload: null });
        showToast(`Se editó la promoción ${nombre}`);
        refreshCurrentRoute();
      } else {
        const res = await fetch('/api/cp/promotions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          dispatch({ type: 'SET_FORM_ERROR', payload: err.error || 'No se pudo crear la promoción.' });
          return;
        }
        const json = await res.json();
        const nextId = Math.max(0, ...data.promotions.map(p => p.id)) + 1;
        const nueva = json.data || { id: nextId, eliminada: false, filtroUsuarios: null, ...payload };
        dispatch({ type: 'UPDATE_DATA', payload: { promotions: [nueva, ...data.promotions] }});
        dispatch({ type: 'SET_MODAL', payload: null });
        showToast(`Se creó la promoción ${nombre}`);
        refreshCurrentRoute();
      }
    } catch {
      dispatch({ type: 'SET_FORM_ERROR', payload: 'Error de red. Verificá la conexión.' });
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state, showToast, refreshCurrentRoute]);

  const saveResolve = useCallback(async () => {
    const { modal, data } = state;
    if (modal?.type !== 'report' || !modal.decision) return;
    const decision = modal.decision;
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      let res: Response;
      try {
        res = await fetch(`/api/cp/reports/${encodeURIComponent(modal.id)}/resolve`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ decision }),
        });
      } catch {
        showToast('No se pudo resolver la disputa. Probá de nuevo.', 'error');
        return;
      }
      if (!res.ok) {
        showToast('No se pudo resolver la disputa. Probá de nuevo.', 'error');
        return;
      }
      dispatch({ type: 'UPDATE_DATA', payload: {
        reports: data.reports.map(r => r.id === modal.id
          ? { ...r, estado: 'RESUELTO' as const, resolucion: 'Resuelto' as const, decision }
          : r)
      }});
      if (state.reportDetail && state.reportDetail.id === modal.id) {
        dispatch({ type: 'SET_REPORT_DETAIL', payload: {
          ...state.reportDetail, estado: 'RESUELTO', resolucion: 'Resuelto', decision,
        }});
      }
      dispatch({ type: 'SET_MODAL', payload: null });
      showToast(`Se resolvió la disputa a ${decision === 'AFavor' ? 'favor' : 'contra'} del reportado`);
      refreshCurrentRoute(true);
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state, showToast, refreshCurrentRoute]);

  const deleteCliente = useCallback(async (id: string, name: string) => {
    let res: Response;
    try {
      res = await fetch(`/api/cp/clientes/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {
      showToast(`No se pudo eliminar el cliente ${name}. Probá de nuevo.`, 'error');
      return;
    }
    if (!res.ok) {
      showToast(`No se pudo eliminar el cliente ${name}. Probá de nuevo.`, 'error');
      return;
    }
    dispatch({ type: 'UPDATE_DATA', payload: { clientes: state.data.clientes.filter(c => c.id_clerk !== id) }});
    dispatch({ type: 'SET_MODAL', payload: null });
    showToast(`Se eliminó el cliente ${name}`);
    refreshCurrentRoute();
  }, [state.data.clientes, showToast, refreshCurrentRoute]);

  const deleteService = useCallback(async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/cp/services/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) {
        dispatch({ type: 'SET_MODAL', payload: null });
        showToast(`No se pudo eliminar el tipo de servicio ${name}. Probá de nuevo.`, 'error');
        return;
      }
    } catch {
      showToast(`No se pudo eliminar el tipo de servicio ${name}. Probá de nuevo.`, 'error');
      return;
    }
    dispatch({ type: 'UPDATE_DATA', payload: { serviceTypes: state.data.serviceTypes.filter(t => t.id !== id) }});
    dispatch({ type: 'SET_MODAL', payload: null });
    showToast(`Se eliminó el tipo de servicio ${name}`);
    refreshCurrentRoute();
  }, [state.data.serviceTypes, showToast, refreshCurrentRoute]);

  const deletePromo = useCallback(async (id: number, name: string) => {
    let res: Response;
    try {
      res = await fetch(`/api/cp/promotions/${encodeURIComponent(String(id))}`, { method: 'DELETE' });
    } catch {
      showToast(`No se pudo eliminar la promoción ${name}. Probá de nuevo.`, 'error');
      return;
    }
    if (!res.ok) {
      showToast(`No se pudo eliminar la promoción ${name}. Probá de nuevo.`, 'error');
      return;
    }
    dispatch({ type: 'UPDATE_DATA', payload: { promotions: state.data.promotions.map(p => p.id === id ? { ...p, eliminada: true } : p) }});
    dispatch({ type: 'SET_MODAL', payload: null });
    showToast(`Se eliminó la promoción ${name}`);
    refreshCurrentRoute();
  }, [state.data.promotions, showToast, refreshCurrentRoute]);

  // Apply persisted theme once, after hydration. The active section is now
  // driven by the URL (Next.js routing), not by localStorage.
  useEffect(() => {
    try {
      const t = localStorage.getItem('cp-theme');
      if (t === 'light') dispatch({ type: 'SET_THEME', payload: 'light' });
    } catch { /* */ }
  }, []);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  return (
    <Ctx.Provider value={{
      state, dispatch, setTheme, showToast, closeModal,
      fetchSummary, fetchCommission, fetchReportDetail,
      saveCliente, saveWorker, saveService, saveCommission, savePromo, saveResolve,
      deleteCliente, deleteService, deletePromo,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
