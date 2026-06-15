export type Theme = 'dark' | 'light';

export type Route =
  | 'dashboard' | 'clientes' | 'workers' | 'pdrivers' | 'priders'
  | 'jobs' | 'viajes' | 'services' | 'transactions' | 'withdrawals'
  | 'commission' | 'promotions' | 'historial' | 'feedback';

export interface Cliente {
  id_clerk: string;
  nombre: string;
  apellido: string;
  mail: string;
  calificacion: number | null;
}

export interface Viaje {
  id_viaje: number;
  id_clerk: string;
  cliente: string;
  tipo: string;
  estado: string;
  driver: string;
  fecha: string;
  pago: { monto: string; estado: string };
}

export interface Worker {
  id: string;
  nombre: string;
  email: string;
  status: 'ONLINE' | 'OFFLINE' | 'EN_TRABAJO';
  onboarding: boolean;
  servicios: string;
  creadoEn: string;
}

export interface Job {
  id: string;
  estado: string;
  rider: string;
  driver: string | null;
  servicio: string;
  direccion: string;
  monto: number;
  creadoEn: string;
}

export interface ServiceType {
  id: string;
  nombre: string;
  descripcion: string;
  precioBase: number;
  drivers: number;
  activos: number;
}

export interface Transaction {
  id: string;
  trabajo: string;
  amount: string;
  status: string;
  rider: string;
  driver: string;
  comision: string | null;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  driver: string;
  cbu: string;
  amount: string;
  status: string;
  createdAt: string;
}

export interface PDriver {
  clerkId: string;
  name: string;
  email: string;
  cbu: string;
  avail: string;
  locked: string;
  txs: number;
  wds: number;
  last: string;
}

export interface PRider {
  clerkId: string;
  name: string;
  email: string;
  txs: number;
  volume: string;
  last: string;
}

export interface Commission {
  rate: string;
  updatedAt: string;
}

export interface ReportUser {
  id: string;
  nombre: string;
  apellido: string;
  rol: 'rider' | 'driver';
}

export interface ReportTrabajo {
  id: string;
  tipoDeTrabajo: string;
  fechaInicio: string;
  fechaFin: string | null;
}

export interface Prueba {
  id: string;
  tipo: 'imagen' | 'video';
}

export interface Report {
  id: string;
  idTrabajo: string;
  idReportante: string;
  idReportado: string;
  estado: 'CREADO' | 'PRUEBAS_AGREGADAS' | 'RESUELTO';
  resolucion: 'SinResolver' | 'Resuelto';
  decision: 'AFavor' | 'EnContra' | null;
  descripcion: string;
  creadoEn: string;
  reportante: ReportUser;
  reportado: ReportUser;
  trabajo: ReportTrabajo;
  pruebas: Prueba[];
}

export interface Promotion {
  id: number;
  nombre: string;
  tipoDescuento: 'porcentaje' | 'monto_fijo';
  valor: number;
  descripcion: string;
  destacada: boolean;
  usoUnico: boolean;
  precioMinimo: number | null;
  categorias: string[];
  eliminada: boolean;
  fechaInicio: string;
  fechaFin: string | null;
  filtroUsuarios: Record<string, unknown> | null;
}

export interface PromoHistory {
  id: number;
  fechaUso: string;
  nombre: string;
  promocionId: number;
  usuario: string;
  usuarioId: string;
  trabajoId: number;
  valorOriginal: number;
  valorPagado: number;
}

export interface SummaryData {
  repairdash: { clientes: number | null; viajes: number | null };
  driver: {
    workers: { total: number; online: number; enTrabajo: number; onboardingPendiente: number } | null;
    jobs: { activos: number; pendientes: number } | null;
    serviceTypes: { total: number } | null;
  };
  payments: {
    commission: { commissionRate: string; updatedAt: string } | null;
    transactionsByStatus: Record<string, number> | null;
    withdrawalsByStatus: Record<string, number> | null;
    users: { riders: number; drivers: number } | null;
  };
  feedback: {
    reportesAbiertos: number | null;
    reportesEnRevision: number | null;
    reportesResueltos: number | null;
    reviewsPendientes: number | null;
  };
  promociones: { total: number | null; usos: number | null };
}

export interface AppData {
  clientes: Cliente[];
  viajes: Viaje[];
  workers: Worker[];
  jobs: Job[];
  serviceTypes: ServiceType[];
  transactions: Transaction[];
  withdrawals: Withdrawal[];
  pdrivers: PDriver[];
  priders: PRider[];
  commission: Commission;
  reports: Report[];
  promotions: Promotion[];
  promoHistory: PromoHistory[];
}

export type ModalType =
  | { type: 'cliente'; id: string; name: string }
  | { type: 'worker'; id: string; name: string; status: 'ONLINE' | 'OFFLINE' | 'EN_TRABAJO' }
  | { type: 'service'; id: string | null }
  | { type: 'promo'; id: number | null }
  | { type: 'confirm'; title: string; desc: string; endpoint: string; fn: () => void }
  | { type: 'report'; id: string; decision: 'AFavor' | 'EnContra' | null };

export interface Toast {
  method: string;
  path: string;
  msg: string;
}

export interface FormState {
  nombre?: string;
  apellido?: string;
  descripcion?: string;
  precio?: string | number;
  tipoDescuento?: 'porcentaje' | 'monto_fijo';
  valor?: string | number;
  categorias?: string[];
  precioMinimo?: string | number;
  destacada?: boolean;
  usoUnico?: boolean;
  fechaInicio?: string;
  fechaFin?: string;
}
