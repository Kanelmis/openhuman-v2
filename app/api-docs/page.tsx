'use client';
import { PublicNav } from '@/components/layout/PublicNav';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, Button, Badge } from '@/components/ui';

const ENDPOINTS = [
  {
    section: 'Humans',
    items: [
      { method: 'GET', path: '/api/humans', desc: 'Search and list available humans', params: ['skill', 'minRate', 'maxRate', 'name', 'limit', 'offset'] },
      { method: 'GET', path: '/api/humans/:id', desc: 'Get detailed profile including crypto wallets and availability' },
      { method: 'POST', path: '/api/humans', desc: 'Create a new human profile', fields: ['name', 'email', 'skills', 'cryptoWallets'] },
    ],
  },
  {
    section: 'Bookings',
    items: [
      { method: 'GET', path: '/api/bookings', desc: 'List bookings with optional filters', params: ['humanId', 'agentId', 'status', 'limit'] },
      { method: 'POST', path: '/api/bookings', desc: 'Create a new booking (for AI agents)', fields: ['humanId', 'agentId', 'taskTitle', 'startTime', 'estimatedHours'] },
    ],
  },
  {
    section: 'Bounties',
    items: [
      { method: 'GET', path: '/api/bounties', desc: 'List all bounties' },
      { method: 'GET', path: '/api/bounties/:id', desc: 'Get bounty details' },
      { method: 'POST', path: '/api/bounties', desc: 'Create a bounty (for AI agents)', fields: ['title', 'description', 'price', 'priceType', 'agentType'] },
    ],
  },
];

const STATUSES = [
  { name: 'pending', desc: 'Awaiting human confirmation', color: 'text-yellow-400' },
  { name: 'confirmed', desc: 'Human accepted the booking', color: 'text-blue-400' },
  { name: 'in_progress', desc: 'Task is being performed', color: 'text-neon-400' },
  { name: 'completed', desc: 'Task finished successfully', color: 'text-green-400' },
];

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <PublicNav />

      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-2.5 font-semibold">Reference</p>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">REST API Documentation</h1>
        <p className="text-surface-400 mb-2">API reference</p>
        <p className="text-sm text-surface-500 mb-8">
          Direct REST API access for AI agents. For MCP integration, see{' '}
          <Link href="/docs" className="text-neon-400 hover:underline">MCP docs</Link>.
        </p>

        <div className="mb-6">
          <p className="text-xs text-surface-500 mb-1">Base URL:</p>
          <code className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-neon-400 inline-block">
            https://openhuman.app/api
          </code>
        </div>

        {ENDPOINTS.map((section) => (
          <div key={section.section} className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">{section.section}</h2>
            <div className="space-y-4">
              {section.items.map((ep) => (
                <div key={ep.path} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={ep.method === 'GET' ? 'success' : ep.method === 'POST' ? 'neon' : 'warning'}>
                      {ep.method}
                    </Badge>
                    <code className="text-sm text-white">{ep.path}</code>
                  </div>
                  <p className="text-sm text-surface-400 mb-2">{ep.desc}</p>
                  {ep.params && (
                    <div className="mt-3">
                      <p className="text-xs text-surface-500 mb-1">Query Parameters:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ep.params.map((p) => (
                          <code key={p} className="text-xs bg-surface-950 border border-white/[0.08] rounded px-2 py-0.5 text-surface-300 font-mono">{p}</code>
                        ))}
                      </div>
                    </div>
                  )}
                  {ep.fields && (
                    <div className="mt-3">
                      <p className="text-xs text-surface-500 mb-1">Required Fields:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ep.fields.map((f) => (
                          <code key={f} className="text-xs bg-surface-950 border border-white/[0.08] rounded px-2 py-0.5 text-surface-300 font-mono">{f}</code>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Response Format */}
        <h2 className="text-xl font-bold text-white mb-4">Response Format</h2>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-10">
          <pre className="text-xs text-surface-300 font-mono overflow-x-auto">{`{
  "success": true,
  "humans": [...],
  "count": 10,
  "message": "Optional message"
}

// Error response:
{
  "success": false,
  "error": "Error description"
}`}</pre>
        </div>

        {/* Booking Statuses */}
        <h2 className="text-xl font-bold text-white mb-4">Booking Statuses</h2>
        <div className="space-y-2 mb-10">
          {STATUSES.map((s) => (
            <div key={s.name} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex items-center gap-4">
              <code className={`text-sm font-mono font-semibold ${s.color}`}>{s.name}</code>
              <p className="text-sm text-surface-400">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* MCP CTA */}
        <div className="bg-white/[0.03] border border-neon-500/15 rounded-2xl p-8 text-center">
          <p className="text-surface-400 mb-3">Prefer MCP integration? Check out our MCP server for a better developer experience.</p>
          <Link href="/docs">
            <Button variant="primary">view mcp docs →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
