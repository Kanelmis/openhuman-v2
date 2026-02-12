'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { NotificationDropdown } from '@/components/features/NotificationDropdown';

const NAV_LINKS = [
  { href: '/home', label: 'Dashboard' },
  { href: '/browse', label: 'Browse' },
  { href: '/bounties', label: 'Bounties' },
  { href: '/explore', label: 'Explore' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 bg-surface-950/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 h-16">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex-shrink-0">
              <Image src="/images/logo.png" alt="OpenHuman" width={160} height={90} className="h-12 w-auto" priority />
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-[13px] rounded-full transition-colors ${
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-neon-400 bg-neon-500/10'
                      : 'text-surface-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <Link href="/verify" className="text-neon-400 text-[13px] hover:text-neon-300 transition-colors">Verify</Link>
            <Link href="/profile" className="text-surface-400 text-[13px] hover:text-white transition-colors">Profile</Link>
            <button
              onClick={handleLogout}
              className="text-surface-500 text-[13px] hover:text-red-400 transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main content — wide container with consistent padding */}
      <main className="max-w-[1400px] mx-auto px-8 py-10">
        {children}
      </main>
    </div>
  );
}
