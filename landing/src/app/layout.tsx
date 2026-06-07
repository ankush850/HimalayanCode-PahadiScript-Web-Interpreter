import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Providers from './providers';
import '../index.css';

export const metadata: Metadata = {
  title: 'HimalayanCode - PahadiScript Web Interpreter',
  description: 'A web-based interpreter for HimalayanCode — a beginner-friendly programming language using Hindi keywords to help engineering students learn coding concepts.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
