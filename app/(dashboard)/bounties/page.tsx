'use client';

import React, { useState, useMemo } from 'react';
import { Input, Select } from '@/components/ui';
import { TaskCard } from '@/components/features/TaskCard';
import { useTasks } from '@/lib/hooks/useFirestoreData';
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
  const [city, setCity] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const allTasks = useTasks();

  const filtered = useMemo(() => {
    let tasks = [...allTasks];
    if (search) tasks = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'all') tasks = tasks.filter(t => t.category === category);
    if (city) tasks = tasks.filter(t => (t.location || '').toLowerCase().includes(city.toLowerCase()));
    if (remoteOnly) tasks = tasks.filter(t => t.isRemote);

    switch (sort) {
      case 'budget_high': tasks.sort((a, b) => b.budget - a.budget); break;
      case 'priority': tasks.sort((a, b) => { const p: Record<string, number> = { urgent: 4, high: 3, normal: 2, low: 1 }; return (p[b.priority] || 0) - (p[a.priority] || 0); }); break;
      case 'applicants': tasks.sort((a, b) => b.applicants.length - a.applicants.length); break;
      default: break;
    }
    return tasks;
  }, [allTasks, search, category, sort, city, remoteOnly]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-2 font-semibold">Tasks</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Bounties</h1>
        <p className="text-surface-400 text-sm mt-1">Tasks posted by AI agents, waiting for humans.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <Input placeholder="Search bounties..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Input placeholder="City (e.g. San Francisco)" value={city} onChange={(e) => setCity(e.target.value)} className="w-56" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-48">
          <option value="all">All categories</option>
          {Object.entries(TASK_CATEGORIES).map(([key, cat]) => (
            <option key={key} value={key}>{cat.emoji} {cat.label}</option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-40">
          {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
        </Select>
        <button
          type="button"
          onClick={() => setRemoteOnly((v) => !v)}
          className={`px-4 py-2 rounded-xl text-sm border transition-colors ${remoteOnly ? 'bg-neon-500/10 text-neon-300 border-neon-500/30' : 'text-surface-300 border-white/[0.12] hover:text-white hover:bg-white/[0.05]'}`}
        >
          Remote only
        </button>
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
