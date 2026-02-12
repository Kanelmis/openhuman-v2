'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Button, Badge, Avatar } from '@/components/ui';
import { DEMO_USERS, DEMO_TASKS } from '@/lib/utils/demo-data';

export default function ProfilePage() {
  const user = DEMO_USERS[0];
  const tasks = DEMO_TASKS.filter(t => t.assignedTo === user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-2 font-semibold">You</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Your Profile</h1>
        <Link href="/home"><Button variant="secondary" size="sm">Edit Profile</Button></Link>
      </div>

      <Card>
        <div className="flex items-start gap-5">
          <Avatar name={user.name} size="xl" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              {user.isVerified && <span className="text-blue-400">●</span>}
              <Badge variant="success">available</Badge>
            </div>
            <p className="text-sm text-surface-400 mb-1">{user.headline || user.skills[0]}</p>
            <p className="text-sm text-surface-500 mb-3">📍 {user.location}</p>
            <p className="text-2xl font-bold text-neon-400">${user.hourlyRate}<span className="text-sm text-surface-500 font-normal">/hr</span></p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-white mb-3">skills</h3>
        <div className="flex flex-wrap gap-2">
          {user.skills.map(s => (
            <span key={s} className="px-3 py-1.5 bg-white/[0.05] border border-neon-500/30 rounded-lg text-xs text-neon-400">{s}</span>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-white mb-2">bio</h3>
        <p className="text-sm text-surface-400">{user.bio}</p>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-xl font-bold text-white">{user.totalTasks}</p>
          <p className="text-xs text-surface-500">tasks</p>
        </Card>
        <Card className="text-center">
          <p className="text-xl font-bold text-yellow-400">⭐ {user.rating > 0 ? user.rating.toFixed(1) : '—'}</p>
          <p className="text-xs text-surface-500">rating</p>
        </Card>
        <Card className="text-center">
          <p className="text-xl font-bold text-white">{user.reviews?.length || 0}</p>
          <p className="text-xs text-surface-500">reviews</p>
        </Card>
      </div>

      {user.walletAddress && (
        <Card>
          <h3 className="text-sm font-semibold text-white mb-2">wallet</h3>
          <code className="text-xs text-neon-400">{user.walletAddress}</code>
        </Card>
      )}
    </div>
  );
}
