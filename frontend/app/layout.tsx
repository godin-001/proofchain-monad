import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProofChain — Reputación Profesional On-Chain',
  description: 'El agente que guía tu carrera y la prueba on-chain. Built on Monad.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#06060f' }}>
        {children}
      </body>
    </html>
  );
}
