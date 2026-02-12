'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input, Select, Button, Badge, Avatar } from '@/components/ui';
import { DEMO_USERS } from '@/lib/utils/demo-data';

const GENDERS = ['all', 'man', 'woman', 'other'];

export default function BrowsePage() {
  const [search, setSearch] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [gender, setGender] = useState('all');

  const filtered = useMemo(() => {
    let users = [...DEMO_USERS];
    if (search) users = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.skills.some(s => s.toLowerCase().includes(search.toLowerCase())));
    if (maxRate) users = users.filter(u => u.hourlyRate <= Number(maxRate));
    return users;
  }, [search, maxRate]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-2 font-semibold">Directory</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Browse Humans</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <Input placeholder="Search by name or skill..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Input type="number" placeholder="Max $/hr" value={maxRate} onChange={(e) => setMaxRate(e.target.value)} className="w-32" />
      </div>

      {/* Gender tabs */}
      <div className="flex gap-2">
        {GENDERS.map(g => (
          <button key={g} onClick={() => setGender(g)}
            className={`px-4 py-1.5 text-sm rounded-full border transition-colors cursor-pointer ${
              gender === g
                ? 'bg-neon-500/10 text-neon-400 border-neon-500/25'
                : 'text-surface-400 border-white/[0.08] hover:border-white/[0.15] hover:text-white'
            }`}>
            {g}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((human) => (
          <Link key={human.id} href={`/humans/${human.id}`}>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-neon-500/20 hover:bg-white/[0.05] transition-all cursor-pointer h-full">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={human.name} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold text-white truncate">{human.name}</h3>
                    {human.isVerified && <span className="text-blue-400 text-[10px]">✓</span>}
                  </div>
                  <p className="text-xs text-surface-500 truncate">{human.headline || human.skills[0]}</p>
                </div>
              </div>
              <p className="text-xs text-surface-500 mb-3">📍 {human.location} {human.isAvailable && <span className="text-neon-400 ml-1">● remote ok</span>}</p>
              <p className="text-xs text-surface-400 line-clamp-2 mb-3 leading-relaxed">{human.bio}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {human.skills.slice(0, 2).map((s) => (
                  <span key={s} className="text-[11px] px-2 py-0.5 bg-white/[0.05] border border-white/[0.08] rounded-md text-surface-400">{s}</span>
                ))}
                {human.skills.length > 2 && (
                  <span className="text-[11px] px-2 py-0.5 bg-white/[0.05] border border-white/[0.08] rounded-md text-surface-500">+{human.skills.length - 2}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-neon-400">${human.hourlyRate}<span className="text-xs text-surface-500 font-normal">/hr</span></p>
                <Button variant="neon" size="sm">Rent</Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
