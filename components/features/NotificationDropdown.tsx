'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DEMO_NOTIFICATIONS } from '@/lib/utils/demo-data';

function formatRelative(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = DEMO_NOTIFICATIONS.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-surface-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.05] cursor-pointer"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-neon-500 rounded-full text-[10px] text-surface-950 font-bold flex items-center justify-center shadow-[0_0_8px_rgba(0,230,118,0.4)]">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface-900 border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <p className="text-sm font-semibold text-white">Notifications</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {DEMO_NOTIFICATIONS.slice(0, 6).map((n) => (
              <div key={n.id} className={`px-4 py-3 border-b border-white/[0.04] transition-colors hover:bg-white/[0.03] ${!n.isRead ? 'bg-neon-500/[0.04]' : ''}`}>
                <p className="text-sm text-white">{n.title}</p>
                <p className="text-xs text-surface-500 mt-1">{formatRelative(n.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
