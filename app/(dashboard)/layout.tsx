'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { NotificationDropdown } from '@/components/features/NotificationDropdown';
import { Input } from '@/components/ui';

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
    <div className="min-h-screen bg-surface-950 text-surface-200">
      <div className="sticky top-0 z-50 border-b border-white/[0.08] bg-surface-950/85 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 pt-3">
          <div className="rounded-2xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
            <span className="text-surface-200 font-medium">OpenHuman Studio preview is enabled for this workspace.</span>
            <span className="text-surface-400 hidden md:inline">Use this dashboard to manage humans, bounties, and agent operations.</span>
            <Link href="/docs" className="ml-auto text-neon-400 hover:text-neon-300 transition-colors">
              View docs
            </Link>
          </div>
        </div>

        <nav className="max-w-[1440px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 md:gap-8 min-w-0">
            <Link href="/" className="flex-shrink-0">
              <Image src="/images/logo.png" alt="OpenHuman" width={150} height={90} className="h-10 w-auto" priority />
            </Link>

            <div className="hidden lg:flex items-center gap-1 rounded-full border border-white/[0.1] bg-white/[0.03] p-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-[13px] rounded-full transition-colors ${
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-white bg-white/[0.14]'
                      : 'text-surface-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:block w-72">
              <Input placeholder="Search tasks, humans, teams..." className="h-9 text-[13px]" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <Link
              href="/verify"
              className="hidden sm:inline-flex px-3 py-1.5 rounded-full border border-neon-500/30 bg-neon-500/[0.08] text-neon-300 text-[13px] hover:bg-neon-500/[0.14] transition-colors"
            >
              Verify
            </Link>
            <Link href="/profile" className="text-surface-300 text-[13px] hover:text-white transition-colors">Profile</Link>
            <button
              onClick={handleLogout}
              className="text-surface-500 text-[13px] hover:text-red-300 transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </nav>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-8 md:py-10">
        {children}
      </main>
    </div>
  );
}
