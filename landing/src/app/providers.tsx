"use client";

import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import VideoBackground from '../components/VideoBackground';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="relative min-h-screen w-full overflow-hidden bg-white font-body select-none">
        {/* Global Background Video Layer */}
        <VideoBackground />

        {/* Subtle Global Background Gradients */}
        <div className="fixed inset-0 bg-gradient pointer-events-none z-0" />
        <div className="fixed inset-0 bg-noise pointer-events-none z-0" />

        {/* Global Header Navigation */}
        <Navbar />

        {/* Main Page Content Wrapper (z-10) */}
        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
