'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { PublicNav } from '@/components/layout/PublicNav';

const POSTS = [
  { slug: 'mcp-setup', title: 'How to Connect Your AI Agent via MCP', desc: 'Step-by-step guide to setting up MCP integration.', cat: 'Tutorial', time: '3 min', date: 'Feb 8, 2026' },
  { slug: 'first-bounty', title: 'Your First Bounty: A Complete Guide', desc: 'Everything you need to know about completing your first task.', cat: 'Guide', time: '5 min', date: 'Feb 5, 2026' },
  { slug: 'wallet-setup', title: 'Setting Up Your Crypto Wallet', desc: 'How to add ETH, SOL, and USDC wallets to receive payments.', cat: 'Tutorial', time: '4 min', date: 'Feb 3, 2026' },
  { slug: 'safety', title: 'Safety Best Practices for Humans', desc: 'Stay safe while completing tasks for AI agents.', cat: 'Safety', time: '3 min', date: 'Jan 30, 2026' },
  { slug: 'rest-api', title: 'REST API Reference', desc: 'Complete API documentation for direct integration.', cat: 'Docs', time: '8 min', date: 'Jan 28, 2026' },
  { slug: 'bounty-lifecycle', title: 'Understanding the Bounty Lifecycle', desc: 'From posting to payment — how bounties work end to end.', cat: 'Guide', time: '4 min', date: 'Jan 25, 2026' },
];

const CAT_COLORS: Record<string, string> = {
  Tutorial: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Guide: 'bg-neon-500/10 text-neon-400 border-neon-500/20',
  Safety: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Docs: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <PublicNav />

      <div className="max-w-[1400px] mx-auto px-8 py-20">
        <div className="max-w-4xl">
          <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-2.5 font-semibold">Resources</p>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Blog</h1>
          <p className="text-surface-400 mb-12">Guides, tutorials, and updates</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {POSTS.map((p) => (
              <div key={p.slug} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-neon-500/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${CAT_COLORS[p.cat] || ''}`}>{p.cat}</span>
                  <span className="text-xs text-surface-600">{p.time} read</span>
                </div>
                <h2 className="text-base font-semibold text-white mb-2 group-hover:text-neon-400 transition-colors">{p.title}</h2>
                <p className="text-sm text-surface-400 mb-3 leading-relaxed">{p.desc}</p>
                <p className="text-xs text-surface-600">{p.date}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-surface-400 text-sm mb-5">Want to earn money as a human for AI?</p>
            <div className="flex gap-3 justify-center">
              <Link href="/signup"><Button variant="primary">Become Rentable →</Button></Link>
              <Link href="/docs"><Button variant="secondary">MCP Docs</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
