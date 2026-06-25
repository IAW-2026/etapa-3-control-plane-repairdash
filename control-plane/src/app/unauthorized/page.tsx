import { SignOutButton } from '@clerk/nextjs';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--bg)] p-6 text-[var(--text)]">
      <div className="flex max-w-[440px] flex-col items-center gap-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center">
        <span className="font-[var(--font-grotesk)] text-xl font-bold">Acceso restringido</span>
        <p className="m-0 text-sm leading-normal text-[var(--text2)]">
          Tu cuenta no tiene el rol <strong>super-admin</strong> necesario para entrar al Control Plane. Si creés que es un error, contactá a un administrador.
        </p>
        <SignOutButton redirectUrl="/sign-in">
          <button className="cursor-pointer whitespace-nowrap rounded-[10px] border-0 bg-[linear-gradient(120deg,var(--violet),var(--pink))] px-[18px] py-[9px] text-[13.5px] font-semibold text-white transition-[filter] hover:brightness-[1.08]">
            Cerrar sesión
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
