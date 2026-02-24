'use client';

import React from 'react';
import { Card, Button, Input, Badge } from '@/components/ui';

export default function ReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-neon-300 uppercase tracking-[0.2em] mb-2 font-semibold">Invite</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Referrals</h1>
        <p className="text-surface-400 text-sm mt-1">Share your invite link and track reward payouts.</p>
      </div>

      <Card glow className="!border-neon-500/20 text-center">
        <p className="text-sm text-surface-400 mb-2">Your referral link</p>
        <div className="flex gap-2 max-w-md mx-auto">
          <Input value="https://openhuman.app/ref/user123" readOnly className="text-center font-mono text-xs" />
          <Button variant="primary" size="sm">Copy</Button>
        </div>
        <p className="text-xs text-surface-500 mt-3">Earn $10 for each human who signs up and completes a task.</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-xs text-surface-500">referred</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-neon-300">$30</p>
          <p className="text-xs text-surface-500">earned</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-white">1</p>
          <p className="text-xs text-surface-500">pending</p>
        </Card>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Referral history</h2>
        <div className="space-y-2">
          {[
            { name: 'Alex M.', date: '3d ago', status: 'completed', reward: 10 },
            { name: 'Sarah K.', date: '1w ago', status: 'completed', reward: 10 },
            { name: 'Jin W.', date: '2w ago', status: 'completed', reward: 10 },
            { name: 'Pat R.', date: '2d ago', status: 'pending', reward: 10 },
          ].map((r, i) => (
            <Card key={i} className="!p-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-white">{r.name}</p>
                <p className="text-xs text-surface-500">{r.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={r.status === 'completed' ? 'success' : 'warning'} className="text-xs">{r.status}</Badge>
                <span className="text-sm font-bold text-neon-300">${r.reward}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
