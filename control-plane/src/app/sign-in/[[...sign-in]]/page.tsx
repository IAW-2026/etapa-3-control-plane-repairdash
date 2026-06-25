import { SignIn } from '@clerk/nextjs';
import { ShieldCheck, Activity, CheckCircle2 } from 'lucide-react';

// Sign-in deshabilita el sign-up: el link apunta a /sign-in y el footer se oculta.
// El control definitivo es la Restriction "Sign-ups" en el dashboard de Clerk.
const clerkAppearance = {
  variables: {
    colorPrimary: '#9D6BFF',
    colorBackground: '#151020',
    colorText: '#F3EEFA',
    colorTextSecondary: '#AC9FC6',
    colorInputBackground: '#1E1730',
    colorInputText: '#F3EEFA',
    colorNeutral: '#F3EEFA',
    borderRadius: '12px',
  },
  elements: {
    rootBox: { width: '100%' },
    cardBox: { width: '100%', boxShadow: 'var(--shadow)' },
    card: { background: 'var(--surface)', border: '1px solid var(--border2)' },
    footerAction: { display: 'none' },
  },
} as const;

export default function SignInPage() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[var(--bg)] p-6 text-[var(--text)]">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[var(--violet)] opacity-25 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-[var(--pink)] opacity-20 blur-[120px]" />

      <div className="relative z-10 flex w-full max-w-[1000px] flex-wrap items-center justify-center gap-[clamp(32px,5vw,72px)]">
        {/* LEFT - presentation */}
        <div className="flex max-w-[460px] flex-[1_1_360px] flex-col items-start gap-6 text-left">
          {/* Brand */}
          <div className="flex flex-col items-start gap-3">
            <div className="grid h-16 w-16 place-items-center rounded-[18px] bg-[linear-gradient(135deg,var(--violet),var(--pink))] text-white shadow-[0_10px_30px_rgba(157,107,255,.35)]">
              <ShieldCheck size={30} strokeWidth={1.75} />
            </div>
            <h1 className="m-0 font-[var(--font-grotesk)] text-[42px] font-bold tracking-normal">
              Control<span className="text-[var(--violet)]">Plane</span>
            </h1>
            <p className="m-0 text-[13px] font-medium tracking-[.04em] text-[var(--text3)]">
              SÚPER ADMIN GLOBAL
            </p>
          </div>

          {/* Context card */}
          <div className="flex w-full flex-col items-start gap-3 rounded-[18px] border border-[var(--border2)] bg-[var(--surface)] p-6">
            <span className="inline-flex items-center gap-[7px] whitespace-nowrap rounded-full bg-[var(--ok-soft)] px-2.5 py-1 text-[11.5px] font-bold text-[var(--ok)]">
              <span className="h-[7px] w-[7px] rounded-full bg-[var(--ok)]" />
              Acceso restringido
            </span>
            <h2 className="m-0 font-[var(--font-grotesk)] text-[19px] font-bold leading-[1.25]">
              Iniciá sesión para administrar el sistema.
            </h2>
            <p className="m-0 text-[13.5px] leading-[1.55] text-[var(--text2)]">
              Visión consolidada de RiderApp, DriverApp, FeedbackApp, PromotionsApp y PaymentsApp.
            </p>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11.5px] text-[var(--text3)]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} strokeWidth={1.75} className="text-[var(--ok)]" /> Acceso seguro
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Activity size={14} strokeWidth={1.75} className="text-[var(--violet)]" /> Tiempo real
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} strokeWidth={1.75} className="text-[var(--pink)]" /> Solo super-admin
            </span>
          </div>
        </div>

        {/* RIGHT - sign-in */}
        <div className="flex min-w-80 flex-[0_1_400px] justify-center">
          <SignIn signUpUrl="/sign-in" appearance={clerkAppearance} />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-4 text-center text-[11px] text-[var(--text3)]">
        © 2026 Control Plane
      </div>
    </main>
  );
}
