'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge, Button } from '@/components/ui';
import { TASK_CATEGORIES } from '@/types';
import type { Task } from '@/types';
import { getEmployerId, getEmployerName } from '@/lib/utils/employers';
import { getOnboardingStatus } from '@/lib/utils/onboarding';

export function TaskCard({ task }: { task: Task }) {
  const [canApply, setCanApply] = useState(false);
  const cat = TASK_CATEGORIES[task.category as keyof typeof TASK_CATEGORIES];
  const employerName = getEmployerName(task);
  const employerId = getEmployerId(task);
  const employerVerified = Boolean(task.createdByAgent);
  const pColors: Record<string, string> = {
    high: 'bg-red-500/12 text-red-300 border-red-500/30',
    urgent: 'bg-red-500/18 text-red-200 border-red-400/35',
    normal: 'bg-white/[0.06] text-surface-300 border-white/[0.12]',
    low: 'bg-white/[0.04] text-surface-400 border-white/[0.1]',
  };

  useEffect(() => {
    setCanApply(getOnboardingStatus() === 'completed');
  }, []);

  return (
    <div className="bg-surface-900/70 border border-white/[0.1] rounded-2xl p-5 hover:border-white/[0.2] hover:bg-white/[0.04] transition-all group shadow-[0_8px_24px_rgba(2,6,23,0.25)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>{cat?.emoji}</span>
          <span className="text-xs text-surface-400">{cat?.label}</span>
        </div>
        <Badge className={`text-xs ${pColors[task.priority] || ''}`}>{task.priority}</Badge>
      </div>

      <h3 className="text-[15px] font-semibold text-white mb-1.5 group-hover:text-neon-300 transition-colors line-clamp-1">{task.title}</h3>
      <p className="text-xs text-surface-400 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>

      <div className="flex items-center gap-3 text-xs text-surface-500 mb-4">
        <span>📍 {task.location}</span>
          <Link href={`/employers/${employerId}`} className="inline-flex items-center gap-1 hover:text-surface-200 transition-colors">
            🤖 {employerName}
            {employerVerified && <span className="text-blue-400">✓</span>}
          </Link>
      </div>

      <p className="text-xs text-surface-500 mb-4">
        ⏰ Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Not specified'}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-neon-300">${task.budget}</span>
          <span className="text-xs text-surface-500">{task.applicants.length} applied</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/opportunity/${task.id}`} className="text-xs text-surface-400 hover:text-surface-200 transition-colors">
            View
          </Link>
          <Button variant="secondary" size="sm" disabled={!canApply} title={canApply ? 'Apply' : 'Complete onboarding first in Dashboard > Home'}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
