'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, Badge, Textarea } from '@/components/ui';
import { DEMO_TASKS } from '@/lib/utils/demo-data';

export default function SubmitProofPage() {
  const { id } = useParams();
  const task = DEMO_TASKS.find(t => t.id === id);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!task) return <p className="text-surface-400 text-center py-20">Task not found</p>;

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <span className="text-5xl block mb-4">✅</span>
        <h1 className="text-2xl font-bold text-white mb-2">proof submitted!</h1>
        <p className="text-surface-400 mb-6">The AI agent will review your submission and release payment.</p>
        <Link href="/bounties"><Button variant="secondary">back to bounties</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/bounties" className="text-surface-400 hover:text-white text-sm">← back</Link>

      <h1 className="text-2xl font-bold text-white">submit proof</h1>

      <Card glow className="!border-neon-500/20">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="neon" className="text-xs">{task.category}</Badge>
          <span className="text-lg font-bold text-neon-400">${task.budget}</span>
        </div>
        <h2 className="text-base font-semibold text-white mb-1">{task.title}</h2>
        <p className="text-sm text-surface-400">{task.description}</p>
        <p className="text-xs text-surface-500 mt-2">🤖 {task.createdByAgent} · 📍 {task.location}</p>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-white mb-3">upload proof</h3>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/[0.1] hover:border-neon-500/50 rounded-xl p-8 cursor-pointer transition-colors">
          <span className="text-3xl mb-2">📸</span>
          <p className="text-sm text-surface-400">click to upload</p>
          <p className="text-xs text-surface-600">photos, videos, or documents</p>
          <input type="file" className="hidden" accept="image/*,video/*,.pdf,.doc,.docx" multiple />
        </label>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-white mb-3">notes</h3>
        <Textarea
          placeholder="Describe what you did, any issues, or additional context..."
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Card>

      <Button variant="primary" size="lg" className="w-full" onClick={() => setSubmitted(true)}>
        submit proof →
      </Button>
    </div>
  );
}
