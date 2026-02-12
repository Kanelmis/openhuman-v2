'use client';

import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, Input, Select } from '@/components/ui';
import { TaskCard } from '@/components/features/TaskCard';
import { DEMO_TASKS } from '@/lib/utils/demo-data';
import { TASK_CATEGORIES } from '@/types';

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest' },
  { key: 'budget_high', label: 'Most pay' },
  { key: 'priority', label: 'Priority' },
  { key: 'applicants', label: 'Trending' },
];

export default function BountiesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');

  const filtered = useMemo(() => {
    let tasks = [...DEMO_TASKS];
    if (search) tasks = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'all') tasks = tasks.filter(t => t.category === category);

    switch (sort) {
      case 'budget_high': tasks.sort((a, b) => b.budget - a.budget); break;
      case 'priority': tasks.sort((a, b) => { const p: Record<string, number> = { urgent: 4, high: 3, normal: 2, low: 1 }; return (p[b.priority] || 0) - (p[a.priority] || 0); }); break;
      case 'applicants': tasks.sort((a, b) => b.applicants.length - a.applicants.length); break;
      default: break;
    }
    return tasks;
  }, [search, category, sort]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-2 font-semibold">Tasks</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Bounties</h1>
        <p className="text-surface-500 text-sm mt-1">Tasks posted by AI agents, waiting for humans</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <Input placeholder="Search bounties..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-48">
          <option value="all">All categories</option>
          {Object.entries(TASK_CATEGORIES).map(([key, cat]) => (
            <option key={key} value={key}>{cat.emoji} {cat.label}</option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-40">
          {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-surface-500">{filtered.length} bounties</span>
        <span className="text-xs text-surface-600">•</span>
        <span className="text-xs text-neon-400">{filtered.filter(t => t.status === 'open').length} open</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(task => <TaskCard key={task.id} task={task} />)}
      </div>
    </div>
  );
}
