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
    <nav className="sticky top-0 z-50 bg-surface-950/90 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 h-16">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex-shrink-0">
            <Image src="/images/logo.png" alt="OpenHuman" width={160} height={90} className="h-12 w-auto" priority />
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-[13px] rounded-full transition-colors ${
                  link.accent
                    ? 'text-neon-400 hover:bg-neon-500/10'
                    : 'text-surface-300 hover:text-white hover:bg-white/5'
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
