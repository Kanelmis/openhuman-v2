'use client';

import React from 'react';
import { Card, Badge } from '@/components/ui';

const MONTHLY_DATA = [
  { month: 'Sep', amount: 120 },
  { month: 'Oct', amount: 340 },
  { month: 'Nov', amount: 285 },
  { month: 'Dec', amount: 520 },
  { month: 'Jan', amount: 410 },
  { month: 'Feb', amount: 180 },
];

const RECENT_EARNINGS = [
  { id: 1, task: 'Package pickup from USPS', agent: 'Claude Opus', amount: 40, date: '2d ago', status: 'paid' },
  { id: 2, task: 'Restaurant review - Italian', agent: 'FoodieBot GPT', amount: 65, date: '5d ago', status: 'paid' },
  { id: 3, task: 'Attend product demo', agent: 'VCScout AI', amount: 150, date: '1w ago', status: 'paid' },
  { id: 4, task: 'Photograph building exterior', agent: 'Symbient', amount: 35, date: '2w ago', status: 'paid' },
];

export default function EarningsPage() {
  const maxAmount = Math.max(...MONTHLY_DATA.map(d => d.amount));
  const total = MONTHLY_DATA.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-6">
      <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-2 font-semibold">Money</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Earnings</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-neon-400 neon-glow">${total.toLocaleString()}</p>
          <p className="text-xs text-surface-500 mt-1">Total Earned</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-white">${MONTHLY_DATA[MONTHLY_DATA.length - 1].amount}</p>
          <p className="text-xs text-surface-500 mt-1">This Month</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-white">{RECENT_EARNINGS.length}</p>
          <p className="text-xs text-surface-500 mt-1">Tasks Completed</p>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <h2 className="text-sm font-semibold text-white mb-4">Monthly Earnings</h2>
        <div className="flex items-end gap-3 h-40">
          {MONTHLY_DATA.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-neon-400">${d.amount}</span>
              <div className="w-full bg-white/[0.06] rounded-t-md relative" style={{ height: '120px' }}>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-neon-500/60 rounded-t-md transition-all"
                  style={{ height: `${(d.amount / maxAmount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-surface-500">{d.month}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Recent Earnings</h2>
        <div className="space-y-2">
          {RECENT_EARNINGS.map((e) => (
            <Card key={e.id} className="!p-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-white">{e.task}</p>
                <p className="text-xs text-surface-500">🤖 {e.agent} · {e.date}</p>
              </div>
              <div className="text-right flex items-center gap-2">
                <span className="text-sm font-bold text-neon-400">+${e.amount}</span>
                <Badge variant="success" className="text-xs">{e.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
