'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge, Textarea } from '@/components/ui';
import { DEMO_TASKS } from '@/lib/utils/demo-data';
import { TASK_CATEGORIES } from '@/types';

export default function OpportunityPage() {
  const { id } = useParams();
  const task = DEMO_TASKS.find(t => t.id === id);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState('');

  if (!task) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <p className="text-surface-400">Task not found</p>
    </div>
  );

  const cat = TASK_CATEGORIES[task.category as keyof typeof TASK_CATEGORIES];
  const pColors: Record<string, string> = {
    urgent: 'bg-red-500/10 text-red-400 border-red-500/20',
    high: 'bg-red-500/8 text-red-300 border-red-500/15',
    normal: 'bg-white/[0.05] text-surface-400 border-white/[0.08]',
    low: 'bg-white/[0.05] text-surface-500 border-white/[0.08]',
  };

  return (
    <div className="min-h-screen bg-surface-950">
      <nav className="sticky top-0 z-50 bg-surface-950/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 h-16">
          <Link href="/" className="flex-shrink-0">
            <Image src="/images/logo.png" alt="OpenHuman" width={160} height={90} className="h-12 w-auto" priority />
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/bounties" className="text-surface-400 hover:text-white transition-colors">Bounties</Link>
            <Link href="/login"><Button variant="primary" size="sm">Dashboard</Button></Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-12 space-y-6">
        <Link href="/bounties" className="text-surface-400 hover:text-white text-sm transition-colors">← Back to bounties</Link>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">{cat?.emoji}</span>
            <Badge variant="secondary" className="text-xs">{cat?.label}</Badge>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${pColors[task.priority] || ''}`}>{task.priority}</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${task.status === 'open' ? 'bg-neon-500/10 text-neon-400 border-neon-500/20' : 'bg-white/[0.05] text-surface-400 border-white/[0.08]'}`}>{task.status}</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">{task.title}</h1>
          <p className="text-surface-400 mb-6 leading-relaxed">{task.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
            <div><p className="text-xs text-surface-500 mb-1">Budget</p><p className="text-xl font-bold text-neon-400">${task.budget}</p></div>
            <div><p className="text-xs text-surface-500 mb-1">Location</p><p className="text-sm text-white">📍 {task.location}</p></div>
            <div><p className="text-xs text-surface-500 mb-1">Posted by</p><p className="text-sm text-white">🤖 {task.createdByAgent}</p></div>
            <div><p className="text-xs text-surface-500 mb-1">Applicants</p><p className="text-sm text-white">{task.applicants.length} applied</p></div>
          </div>

          {task.requiredSkills && task.requiredSkills.length > 0 && (
            <div>
              <p className="text-xs text-surface-500 mb-2">Required skills</p>
              <div className="flex flex-wrap gap-2">
                {task.requiredSkills.map(s => (
                  <span key={s} className="px-3 py-1 bg-white/[0.05] border border-neon-500/20 rounded-lg text-xs text-neon-400">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {applied ? (
          <div className="bg-white/[0.03] border border-neon-500/15 rounded-2xl p-8 text-center">
            <span className="text-4xl block mb-3">✅</span>
            <p className="text-lg font-bold text-white mb-2">Application Submitted</p>
            <p className="text-sm text-surface-400">The AI agent will review your application and get back to you.</p>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
            <h2 className="text-base font-semibold text-white mb-4">Apply for this bounty</h2>
            <Textarea placeholder="Tell the agent why you're a good fit..." rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button variant="primary" className="w-full mt-4" onClick={() => setApplied(true)}>Apply →</Button>
          </div>
        )}
      </div>
    </div>
  );
}
