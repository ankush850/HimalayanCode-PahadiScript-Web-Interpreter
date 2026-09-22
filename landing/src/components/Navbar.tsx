"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `text-sm font-medium transition-colors ${
      isActive ? 'text-black font-semibold' : 'text-[#6F6F6F] hover:text-black'
    }`;
  };

  return (
    <header className="relative z-10 w-full">
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-display font-normal tracking-tight text-black flex items-center gap-3 select-none"
        >
          <img src="/logo.png" alt="HimalayanCode Logo" className="w-8 h-8 object-contain" />
          <span>HimalayanCode</span>
        </Link>

        {/* Menu Items */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className={getLinkClass('/')}>
            Home
          </Link>
          <Link href="/editor" className={getLinkClass('/editor')}>
            Editor
          </Link>
          <Link href="/dashboard" className={getLinkClass('/dashboard')}>
            Dashboard
          </Link>
          <Link href="/history" className={getLinkClass('/history')}>
            History
          </Link>
          <a
            href="/#keywords-guide"
            className="text-sm font-medium text-[#6F6F6F] hover:text-black transition-colors"
          >
            Keywords
          </a>
          <a
            href="https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#6F6F6F] hover:text-black transition-colors"
          >
            GitHub
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/editor')}
            className="rounded-full px-6 py-2.5 text-sm bg-black text-white hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 font-medium shadow-xs"
          >
            Launch Web Editor
          </button>
        </div>
      </nav>
    </header>
  );
}
