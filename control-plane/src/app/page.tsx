import { StoreProvider } from '@/lib/store';
import { ControlPlane } from '@/components/ControlPlane';

export default function Home() {
  return (
    <StoreProvider>
      <ControlPlane />
    </StoreProvider>
  );
}
