'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Button, Badge, Input } from '@/components/ui';
import { DEMO_TASKS, DEMO_USERS } from '@/lib/utils/demo-data';
import { TASK_CATEGORIES } from '@/types';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const categories = Object.entries(TASK_CATEGORIES);
  const openTasks = DEMO_TASKS.filter(t => t.status === 'open');

  return (
    <div className="space-y-6">
      <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-2 font-semibold">Discover</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Explore</h1>
      <Input placeholder="Search tasks, skills, locations..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {/* Categories */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map(([key, cat]) => (
            <Card key={key} className="text-center hover:border-neon-500/20 transition-all cursor-pointer">
              <span className="text-2xl block mb-2">{cat.emoji}</span>
              <p className="text-xs font-medium text-white">{cat.label}</p>
              <p className="text-xs text-surface-500 mt-1">{DEMO_TASKS.filter(t => t.category === key).length} tasks</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Bounties */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Featured Bounties</h2>
          <Link href="/bounties" className="text-neon-400 text-xs font-medium hover:text-neon-300">view all →</Link>
        </div>
        <div className="space-y-2">
          {openTasks.slice(0, 5).map((task) => {
            const cat = TASK_CATEGORIES[task.category as keyof typeof TASK_CATEGORIES];
            return (
              <Card key={task.id} className="!p-3 flex items-center justify-between hover:border-white/[0.12] transition-colors">
                <div className="flex items-center gap-3">
                  <span>{cat?.emoji}</span>
                  <div>
                    <p className="text-sm text-white">{task.title}</p>
                    <p className="text-xs text-surface-500">🤖 {task.createdByAgent} · 📍 {task.location}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-neon-400">${task.budget}</span>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Top Humans */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Top Rated Humans</h2>
          <Link href="/browse" className="text-neon-400 text-xs font-medium hover:text-neon-300">view all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DEMO_USERS.filter(u => u.rating > 0).sort((a, b) => b.rating - a.rating).slice(0, 3).map((user) => (
            <Link key={user.id} href={`/humans/${user.id}`}>
              <Card className="hover:border-neon-500/20 transition-all">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-surface-500">📍 {user.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-yellow-400">⭐ {user.rating.toFixed(1)}</span>
                  <span className="text-sm font-bold text-neon-400">${user.hourlyRate}/hr</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
