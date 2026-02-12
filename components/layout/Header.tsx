'use client';

import React, { useState } from 'react';
import { Input, Badge } from '@/components/ui';
import { DEMO_NOTIFICATIONS } from '@/lib/utils/demo-data';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = DEMO_NOTIFICATIONS.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-white/5 bg-surface-950/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex-1 max-w-md">
        <Input
          placeholder="Search tasks, humans, skills..."
          icon={<span className="text-sm">🔍</span>}
          className="bg-white/3 border-white/5 text-sm h-9"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium text-green-400">Online</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <span className="text-lg">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-card p-2 shadow-2xl">
              <h3 className="text-sm font-semibold text-white px-3 py-2">Notifications</h3>
              {DEMO_NOTIFICATIONS.map(n => (
                <div
                  key={n.id}
                  className={`px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    n.isRead ? 'hover:bg-white/3' : 'bg-neon-600/5 hover:bg-neon-600/10'
                  }`}
                >
                  <p className="text-sm text-white">{n.title}</p>
                  <p className="text-xs text-surface-400 mt-0.5">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
