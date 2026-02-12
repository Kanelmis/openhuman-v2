'use client';

import React from 'react';
import Link from 'next/link';
import { Badge, Button } from '@/components/ui';
import { TASK_CATEGORIES } from '@/types';
import type { Task } from '@/types';

export function TaskCard({ task }: { task: Task }) {
  const cat = TASK_CATEGORIES[task.category as keyof typeof TASK_CATEGORIES];
  const pColors: Record<string, string> = {
    high: 'bg-red-500/10 text-red-400 border-red-500/20',
    urgent: 'bg-red-500/15 text-red-300 border-red-400/25',
    normal: 'bg-white/[0.05] text-surface-400 border-white/[0.08]',
    low: 'bg-white/[0.05] text-surface-500 border-white/[0.08]',
  };

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-neon-500/20 hover:bg-white/[0.05] transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>{cat?.emoji}</span>
          <span className="text-xs text-surface-500">{cat?.label}</span>
        </div>
        <Badge className={`text-xs ${pColors[task.priority] || ''}`}>{task.priority}</Badge>
      </div>

      <h3 className="text-sm font-semibold text-white mb-1.5 group-hover:text-neon-400 transition-colors line-clamp-1">{task.title}</h3>
      <p className="text-xs text-surface-400 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>

      <div className="flex items-center gap-3 text-xs text-surface-500 mb-4">
        <span>📍 {task.location}</span>
        <span>🤖 {task.createdByAgent}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-neon-400">${task.budget}</span>
          <span className="text-xs text-surface-500">{task.applicants.length} applied</span>
        </div>
        <Link href={`/opportunity/${task.id}`}>
          <Button variant="neon" size="sm">Apply</Button>
        </Link>
      </div>
    </div>
  );
}
