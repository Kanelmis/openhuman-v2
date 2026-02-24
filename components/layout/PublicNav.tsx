'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui';

const NAV_LINKS = [
  { href: '/browse', label: 'Browse' },
  { href: '/bounties', label: 'Bounties' },
  { href: '/explore', label: 'Explore' },
  { href: '/docs', label: 'For Agents' },
  { href: '/verify', label: 'Verify', accent: true },
];

export function PublicNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-surface-950/85 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 md:gap-8 min-w-0">
          <Link href="/" className="flex-shrink-0">
            <Image src="/images/logo.png" alt="OpenHuman" width={150} height={90} className="h-10 w-auto" priority />
          </Link>
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-white/[0.1] bg-white/[0.03] p-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-[13px] rounded-full transition-colors ${
                  link.accent
                    ? 'text-neon-300 bg-neon-500/[0.08] hover:bg-neon-500/[0.14]'
                    : 'text-surface-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
