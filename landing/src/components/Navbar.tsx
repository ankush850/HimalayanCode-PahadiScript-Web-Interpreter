"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  const handleBeginJourney = () => {
    if (user) {
      router.push('/editor');
    } else {
      router.push('/login');
    }
  };

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `text-sm font-medium transition-colors ${isActive ? 'text-black font-semibold' : 'text-[#6F6F6F] hover:text-black'}`;
  };

  return (
    <header className="relative z-10 w-full">
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-3xl font-display font-normal tracking-tight text-black flex items-center gap-3 select-none">
          <img src="/logo.png" alt="HimalayanCode Logo" className="w-8 h-8 object-contain" />
          <span>HimalayanCode</span>
        </Link>

        {/* Menu Items */}
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
              <Link
                href="/"
                className={getLinkClass('/')}
              >
                Home
              </Link>
              <Link
                href="/editor"
                className={getLinkClass('/editor')}
              >
                Editor
              </Link>
              <Link
                href="/dashboard"
                className={getLinkClass('/dashboard')}
              >
                Dashboard
              </Link>
              <Link
                href="/history"
                className={getLinkClass('/history')}
              >
                History
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                className={getLinkClass('/')}
              >
                Home
              </Link>
              <a
                href="#"
                className="text-sm font-medium text-[#6F6F6F] hover:text-black transition-colors"
              >
                Studio
              </a>
              <a
                href="#"
                className="text-sm font-medium text-[#6F6F6F] hover:text-black transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-sm font-medium text-[#6F6F6F] hover:text-black transition-colors"
              >
                Journal
              </a>
              <a
                href="#"
                className="text-sm font-medium text-[#6F6F6F] hover:text-black transition-colors"
              >
                Reach Us
              </a>
            </>
          )}
        </div>

        {/* Auth Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-[#6F6F6F] font-medium hidden sm:inline select-text">
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full px-6 py-2.5 text-sm bg-transparent border border-black/10 text-black hover:bg-black hover:text-white transition-all duration-200 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleBeginJourney}
              className="rounded-full px-6 py-2.5 text-sm bg-black text-white hover:scale-[1.03] transition-transform duration-300 ease-out font-medium"
            >
              Begin Journey
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

