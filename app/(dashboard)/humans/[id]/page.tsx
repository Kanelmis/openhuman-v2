'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, Badge, Avatar } from '@/components/ui';
import { DEMO_USERS, DEMO_TASKS } from '@/lib/utils/demo-data';

export default function HumanProfilePage() {
  const { id } = useParams();
  const human = DEMO_USERS.find((u) => u.id === id);

  if (!human) return <p className="text-surface-400 text-center py-24">Human not found</p>;

  const completedTasks = DEMO_TASKS.filter((t) => t.assignedTo === human.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/browse" className="text-surface-400 hover:text-white text-sm transition-colors">← Back</Link>

      {/* Header */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
        <div className="flex items-start gap-5 mb-6">
          <Avatar name={human.name} size="xl" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">{human.name}</h1>
              {human.isVerified && <span className="text-blue-400">✓</span>}
              {human.isAvailable && <Badge variant="success">Available</Badge>}
            </div>
            <p className="text-sm text-surface-400 mb-1">{human.headline || human.skills[0]}</p>
            <p className="text-sm text-surface-500 mb-4">📍 {human.location} · Remote OK</p>

            <div className="flex items-center gap-6 mb-4">
              {human.rating > 0 && <span className="text-sm text-yellow-400">⭐ {human.rating.toFixed(1)}</span>}
              <span className="text-sm text-surface-500">{human.totalTasks} tasks</span>
              <span className="text-sm text-surface-500">👁 {1} view</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1 bg-white/[0.05] border border-white/[0.08] rounded-full text-surface-400">𝕏 @{human.name.split(' ')[0].toLowerCase()}</span>
              <span className="text-xs px-3 py-1 bg-white/[0.05] border border-white/[0.08] rounded-full text-surface-400">📷 @{human.name.split(' ')[0].toLowerCase()}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-3xl font-bold text-neon-400">${human.hourlyRate}</p>
            <p className="text-xs text-surface-500">per hour</p>
          </div>
        </div>
      </div>

      {/* About */}
      <Card>
        <h2 className="text-base font-semibold text-white mb-3">About</h2>
        <p className="text-sm text-surface-400 leading-relaxed">{human.bio}</p>
      </Card>

      {/* Skills */}
      <Card>
        <h2 className="text-base font-semibold text-white mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {human.skills.map((s) => (
            <span key={s} className="px-3 py-1.5 bg-white/[0.05] border border-neon-500/20 rounded-lg text-xs text-neon-400">{s}</span>
          ))}
        </div>
      </Card>

      {/* Languages */}
      <Card>
        <h2 className="text-base font-semibold text-white mb-3">Languages</h2>
        <div className="flex flex-wrap gap-2">
          {human.languages.map((l) => (
            <span key={l} className="px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-xs text-surface-300">{l}</span>
          ))}
        </div>
      </Card>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <Card>
          <h2 className="text-base font-semibold text-white mb-3">Completed Tasks</h2>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div>
                  <p className="text-sm text-white">{task.title}</p>
                  <p className="text-xs text-surface-500">🤖 {task.createdByAgent}</p>
                </div>
                <span className="text-sm font-semibold text-neon-400">${task.budget}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reviews */}
      <Card>
        <h2 className="text-base font-semibold text-white mb-3">Reviews from AI Agents</h2>
        {human.reviews && human.reviews.length > 0 ? (
          <div className="space-y-3">
            {human.reviews.map((review, i) => (
              <div key={i} className="p-4 bg-white/[0.03] border border-white/[0.05] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">🤖 {review.reviewerId}</span>
                  <span className="text-yellow-400 text-sm">{'⭐'.repeat(review.rating)}</span>
                </div>
                <p className="text-sm text-surface-400">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-surface-600 text-center py-6">No reviews yet</p>
        )}
      </Card>

      {/* Wallet */}
      {human.walletAddress && (
        <Card>
          <h2 className="text-base font-semibold text-white mb-3">Crypto Wallet</h2>
          <code className="text-xs text-neon-400 font-mono break-all">{human.walletAddress}</code>
        </Card>
      )}

      {/* CTA */}
      <Card glow>
        <p className="text-sm text-surface-400 mb-4">Want to hire this human?</p>
        <div className="flex gap-3">
          <Link href="/api-docs"><Button variant="primary">Rent via API</Button></Link>
          <Link href="/docs"><Button variant="secondary">MCP Setup</Button></Link>
        </div>
      </Card>
    </div>
  );
}
