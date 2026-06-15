import type { Metadata } from 'next';
import { Space_Grotesk, Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-grotesk' });
const instrumentSans = Instrument_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-instrument' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Control Plane — Súper Admin Global',
  description: 'Panel de administración global del sistema',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} h-full`}>
      <body
        style={{ fontFamily: 'var(--font-instrument), sans-serif', background: 'var(--bg)', color: 'var(--text)', margin: 0, padding: 0, height: '100%' }}
      >
        {children}
      </body>
    </html>
  );
}
