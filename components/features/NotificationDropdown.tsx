'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/lib/hooks/useFirestoreData';

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
  const notifications = useNotifications();
  const unread = notifications.filter((n) => !n.isRead).length;

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
        className="relative text-surface-300 hover:text-white transition-colors px-2.5 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.08] cursor-pointer"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-neon-500 rounded-full text-[10px] text-surface-950 font-bold flex items-center justify-center shadow-[0_0_0_4px_rgba(16,185,129,0.15)]">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface-900/95 border border-white/[0.12] rounded-2xl shadow-[0_20px_45px_rgba(2,6,23,0.55)] overflow-hidden z-50 backdrop-blur-sm">
          <div className="px-4 py-3 border-b border-white/[0.08]">
            <p className="text-sm font-semibold text-white">Notifications</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 6).map((n) => (
              <div key={n.id} className={`px-4 py-3 border-b border-white/[0.05] transition-colors hover:bg-white/[0.05] ${!n.isRead ? 'bg-neon-500/[0.08]' : ''}`}>
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
