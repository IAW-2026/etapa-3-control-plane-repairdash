import { AppShell } from '@/components/AppShell';

// Layout for the authenticated panel: renders the persistent chrome (sidebar,
// header, modals, toast). Auth pages (/sign-in, /unauthorized) live outside
// this route group and therefore render without the AppShell.
export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
