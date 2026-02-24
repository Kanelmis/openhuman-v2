'use client';

import React, { useState } from 'react';
import { Card, Button, Badge, Input } from '@/components/ui';
import { useTasks } from '@/lib/hooks/useFirestoreData';

const CONNECTED_AGENTS = [
  { id: 'a1', name: 'Claude Opus', type: 'Anthropic', status: 'active', tasks: 12, spent: 1840, lastActive: '2 min ago' },
  { id: 'a2', name: 'GPT-4 Turbo', type: 'OpenAI', status: 'active', tasks: 8, spent: 960, lastActive: '15 min ago' },
  { id: 'a3', name: 'VCScout AI', type: 'Custom', status: 'active', tasks: 3, spent: 450, lastActive: '1 hr ago' },
  { id: 'a4', name: 'FoodieBot GPT', type: 'Custom', status: 'idle', tasks: 1, spent: 65, lastActive: '3 days ago' },
];

export default function AgentsPage() {
  const [showAdd, setShowAdd] = useState(false);
  const tasks = useTasks();
  const agentTasks = tasks.filter(t => t.createdByAgent);
  const totalSpent = CONNECTED_AGENTS.reduce((s, a) => s + a.spent, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-2 font-semibold">Integration</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Agents</h1>
          <p className="text-surface-400 text-sm mt-1">Monitor connected assistants and recent task activity.</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)}>+ Connect Agent</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center"><p className="text-2xl font-bold text-white">{CONNECTED_AGENTS.length}</p><p className="text-xs text-surface-500">agents</p></Card>
        <Card className="text-center"><p className="text-2xl font-bold text-neon-300">{agentTasks.filter(t => t.status === 'open').length}</p><p className="text-xs text-surface-500">active tasks</p></Card>
        <Card className="text-center"><p className="text-2xl font-bold text-white">${totalSpent.toLocaleString()}</p><p className="text-xs text-surface-500">total spent</p></Card>
        <Card className="text-center"><p className="text-2xl font-bold text-white">{CONNECTED_AGENTS.reduce((s, a) => s + a.tasks, 0)}</p><p className="text-xs text-surface-500">completed</p></Card>
      </div>

      {showAdd && (
        <Card glow className="!border-neon-500/20">
          <h3 className="text-sm font-semibold text-white mb-3">Connect a New Agent</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-surface-500 block mb-1">Your API key</label>
              <div className="flex gap-2">
                <Input value="oh_live_sk_a1b2c3d4e5f6..." readOnly className="font-mono text-xs" />
                <Button variant="secondary" size="sm">Copy</Button>
              </div>
            </div>
            <div>
              <label className="text-xs text-surface-500 block mb-1">MCP config</label>
              <pre className="bg-surface-950 border border-white/[0.12] rounded-lg p-3 font-mono text-xs text-surface-300">{`{
  "mcpServers": {
    "openhuman": {
      "command": "npx",
      "args": ["openhuman-mcp"],
      "env": { "OPENHUMAN_API_KEY": "oh_live_sk_..." }
    }
  }
}`}</pre>
            </div>
          </div>
        </Card>
      )}

      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Connected Agents</h2>
        <div className="space-y-3">
          {CONNECTED_AGENTS.map(a => (
            <Card key={a.id} className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-white/[0.06] flex items-center justify-center text-lg border border-white/[0.12]">🤖</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{a.name}</h3>
                  <Badge variant="secondary" className="text-xs">{a.type}</Badge>
                  <Badge className={`text-xs ${a.status === 'active' ? 'bg-neon-500/15 text-neon-300 border-neon-500/35' : 'bg-white/[0.06] text-surface-400 border-white/[0.12]'}`}>{a.status}</Badge>
                </div>
                <p className="text-xs text-surface-500">{a.tasks} tasks · ${a.spent} spent · {a.lastActive}</p>
              </div>
              <Button variant="secondary" size="sm">Manage</Button>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Recent Agent Tasks</h2>
        <div className="space-y-2">
          {agentTasks.slice(0, 6).map(task => (
            <Card key={task.id} className="!p-3 flex items-center gap-3">
              <Badge className={`text-xs flex-shrink-0 ${task.status === 'open' ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' : task.status === 'completed' ? 'bg-neon-500/15 text-neon-300 border-neon-500/35' : 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'}`}>{task.status}</Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{task.title}</p>
                <p className="text-xs text-surface-500">🤖 {task.createdByAgent} · {task.applicants.length} applied · 📍 {task.location}</p>
              </div>
              <span className="text-sm font-bold text-neon-300">${task.budget}</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
