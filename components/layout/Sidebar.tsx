'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui';
import { getCurrentUser } from '@/lib/utils/demo-data';

const NAV_ITEMS = [
  { href: '/home', icon: '🏠', label: 'Dashboard' },
  { href: '/humans', icon: '🧑‍🤝‍🧑', label: 'Browse Humans' },
  { href: '/bounties', icon: '🎯', label: 'Task Bounties' },
  { href: '/agents', icon: '🤖', label: 'AI Agents' },
  { href: '/explore', icon: '🔍', label: 'Explore' },
  { href: '/wallet', icon: '💰', label: 'Wallet' },
  { href: '/earnings', icon: '📊', label: 'Earnings' },
  { href: '/referrals', icon: '🤝', label: 'Referrals' },
  { href: '/profile', icon: '👤', label: 'Profile' },
  { href: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const user = getCurrentUser();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-surface-950 border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <Link href="/home" className="flex items-center gap-2.5">
          <span className="text-2xl">🦾</span>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">OpenHuman</h1>
            <p className="text-[10px] text-surface-500 uppercase tracking-widest">meatspace layer</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                isActive
                  ? 'bg-neon-600/10 text-neon-400'
                  : 'text-surface-400 hover:text-white hover:bg-white/5'
              )}
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* API Section */}
      <div className="p-3 border-t border-white/5">
        <Link
          href="/docs"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-surface-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <span className="text-base">🔌</span>
          <span className="font-medium">API / MCP Docs</span>
        </Link>
      </div>

      {/* User */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-surface-500 truncate">{user.location}</p>
          </div>
          <div className={cn('w-2 h-2 rounded-full', user.isAvailable ? 'bg-green-400' : 'bg-surface-500')} />
        </div>
      </div>
    </aside>
  );
}
