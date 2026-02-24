'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Input } from '@/components/ui';
import { useTasks, useUsers } from '@/lib/hooks/useFirestoreData';
import { TASK_CATEGORIES } from '@/types';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const tasks = useTasks();
  const users = useUsers();
  const categories = Object.entries(TASK_CATEGORIES);
  const openTasks = tasks.filter(t => t.status === 'open');

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-2 font-semibold">Discover</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Explore</h1>
        <p className="text-surface-400 text-sm mt-1">Browse categories, hot bounties, and top-rated local operators.</p>
      </div>

      <Input placeholder="Search tasks, skills, locations..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map(([key, cat]) => (
            <Card
              key={key}
              className="!py-4 !px-5 flex items-center justify-between hover:border-white/[0.18] hover:bg-white/[0.05] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl">{cat.emoji}</span>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-white truncate">{cat.label}</p>
                  <p className="text-xs text-surface-400">{tasks.filter(t => t.category === key).length} tasks</p>
                </div>
              </div>
              <span className="text-surface-500 text-xl">›</span>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Featured Bounties</h2>
          <Link href="/bounties" className="text-neon-400 text-xs font-medium hover:text-neon-300">View all</Link>
        </div>
        <div className="space-y-2">
          {openTasks.slice(0, 5).map((task) => {
            const cat = TASK_CATEGORIES[task.category as keyof typeof TASK_CATEGORIES];
            return (
              <div key={task.id} className="rounded-xl border border-white/[0.1] bg-white/[0.03] p-3 flex items-center justify-between hover:bg-white/[0.06] transition-colors">
                <div className="flex items-center gap-3">
                  <span>{cat?.emoji}</span>
                  <div>
                    <p className="text-sm text-white">{task.title}</p>
                    <p className="text-xs text-surface-500">🤖 {task.createdByAgent} · 📍 {task.location}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-neon-300">${task.budget}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Top Rated Humans</h2>
          <Link href="/browse" className="text-neon-400 text-xs font-medium hover:text-neon-300">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {users.filter(u => u.rating > 0).sort((a, b) => b.rating - a.rating).slice(0, 3).map((user) => (
            <Link key={user.id} href={`/humans/${user.id}`}>
              <div className="rounded-xl border border-white/[0.1] bg-white/[0.03] p-4 hover:border-white/[0.18] transition-all">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-surface-500">📍 {user.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-yellow-400">⭐ {user.rating.toFixed(1)}</span>
                  <span className="text-sm font-bold text-neon-300">${user.hourlyRate}/hr</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
