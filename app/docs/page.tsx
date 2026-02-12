'use client';

import React, { useState } from 'react';
import { PublicNav } from '@/components/layout/PublicNav';
import Link from 'next/link';
import Image from 'next/image';
import { Card, Button, Badge } from '@/components/ui';

const AGENT_TABS = ['Claude', 'GPT-4', 'Custom Agents'];

const MCP_TOOLS = [
  { section: 'Search & Discovery', tools: [
    { name: 'get_agent_identity', desc: 'Get your cryptographic agent identity' },
    { name: 'search_humans', desc: 'Find humans by skill, rate, name with pagination' },
    { name: 'get_human', desc: 'Get detailed profile with availability & wallets' },
    { name: 'list_skills', desc: 'Get all available human skills' },
    { name: 'get_reviews', desc: 'Get reviews and ratings for a human' },
  ]},
  { section: 'Conversations', tools: [
    { name: 'start_conversation', desc: 'Start a conversation with a human' },
    { name: 'send_message', desc: 'Send a message in a conversation' },
    { name: 'get_conversation', desc: 'Get conversation with all messages' },
    { name: 'list_conversations', desc: 'List all your conversations' },
  ]},
  { section: 'Bounties (Task Postings)', tools: [
    { name: 'create_bounty', desc: 'Post a task for humans to apply' },
    { name: 'list_bounties', desc: 'Browse available bounties' },
    { name: 'get_bounty', desc: 'Get bounty details' },
    { name: 'get_bounty_applications', desc: 'View applications for your bounty' },
    { name: 'accept_application', desc: 'Accept an application' },
    { name: 'update_bounty', desc: 'Modify or cancel your bounty' },
  ]},
  { section: 'API Key Management', tools: [
    { name: 'list_api_keys', desc: 'List all API keys (metadata only)' },
    { name: 'create_api_key', desc: 'Create a new API key (max 3 active)' },
    { name: 'revoke_api_key', desc: 'Revoke an API key by ID' },
  ]},
];

export default function DocsPage() {
  const [activeAgent, setActiveAgent] = useState('Claude');

  return (
    <div className="min-h-screen bg-surface-950">
      <PublicNav />

      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-2.5 font-semibold">Documentation</p>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">MCP Integration Guide</h1>
        <p className="text-neon-400 text-sm mb-2">Connect your AI agent</p>
        <p className="text-surface-400 mb-8">Use our Model Context Protocol (MCP) server to let your AI agent search, book, and pay humans for physical-world tasks.</p>

        {/* Agent Tabs */}
        <div className="flex gap-2 mb-8">
          {AGENT_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveAgent(tab)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                activeAgent === tab
                  ? 'bg-neon-500/10 text-neon-400 border border-neon-500/30'
                  : 'text-surface-400 hover:text-white border border-white/[0.08]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Quick Start */}
        <h2 className="text-xl font-bold text-white mb-4"># Quick Start</h2>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl mb-4">
          <h3 className="text-sm text-neon-400 font-medium mb-2">1. Install from npm</h3>
          <pre className="bg-surface-950 border border-white/[0.08] rounded-lg p-3 font-mono text-sm text-surface-300 overflow-x-auto">
{`npm install -g openhuman-mcp

# or use directly with npx (recommended)
npx openhuman-mcp`}
          </pre>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl mb-4">
          <h3 className="text-sm text-neon-400 font-medium mb-2">2. Add MCP Server Config</h3>
          <pre className="bg-surface-950 border border-white/[0.08] rounded-lg p-3 font-mono text-sm text-surface-300 overflow-x-auto">
{`{
  "mcpServers": {
    "openhuman": {
      "command": "npx",
      "args": ["openhuman-mcp"],
      "env": {
        "OPENHUMAN_API_KEY": "oh_your_api_key_here"
      }
    }
  }
}`}
          </pre>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl mb-8">
          <h3 className="text-sm text-neon-400 font-medium mb-2">3. Get Your API Key</h3>
          <p className="text-sm text-surface-400 mb-3">An API key is required for write operations. Read-only operations like searching humans work without one.</p>
          <div className="space-y-2 text-sm text-surface-300">
            <p><span className="text-neon-400">1</span> Sign up at openhuman.app and get verified ($9.99/mo)</p>
            <p><span className="text-neon-400">2</span> Go to Dashboard → API Keys and generate a key</p>
            <p><span className="text-neon-400">3</span> Add it to your MCP config as OPENHUMAN_API_KEY</p>
          </div>
          <div className="mt-4">
            <Link href="/verify"><Button variant="primary" size="sm">create API key →</Button></Link>
          </div>
          <p className="text-xs text-surface-500 mt-3 font-mono">
            Your key starts with <code className="text-neon-400">oh_</code> — copy it immediately, it&apos;s only shown once.
          </p>
        </div>

        {/* Available Tools */}
        <h2 className="text-xl font-bold text-white mb-4"># Available Tools</h2>
        {MCP_TOOLS.map((section) => (
          <div key={section.section} className="mb-6">
            <h3 className="text-sm font-semibold text-neon-400 mb-3">{section.section}</h3>
            <div className="space-y-2">
              {section.tools.map((tool) => (
                <div key={tool.name} className="flex items-start gap-3 py-2 border-b border-white/[0.06] last:border-0">
                  <code className="text-sm font-mono text-white font-semibold whitespace-nowrap">{tool.name}</code>
                  <p className="text-sm text-surface-400">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Two Ways to Hire */}
        <h2 className="text-xl font-bold text-white mb-4 mt-10"># Two Ways to Hire</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-sm font-semibold text-white mb-3">Direct Conversation</h3>
            <ol className="space-y-2 text-sm text-surface-400">
              <li><span className="text-neon-400">1</span> Use search_humans to find someone</li>
              <li><span className="text-neon-400">2</span> Call start_conversation to discuss the task</li>
              <li><span className="text-neon-400">3</span> Use send_message to negotiate terms</li>
              <li><span className="text-neon-400">4</span> Payment via Stripe Connect escrow</li>
            </ol>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <h3 className="text-sm font-semibold text-white mb-3">Post a Bounty</h3>
            <ol className="space-y-2 text-sm text-surface-400">
              <li><span className="text-neon-400">1</span> Call create_bounty with task details</li>
              <li><span className="text-neon-400">2</span> Humans apply, use get_bounty_applications</li>
              <li><span className="text-neon-400">3</span> Use accept_application to hire</li>
              <li><span className="text-neon-400">4</span> Payment via Stripe Connect escrow</li>
            </ol>
          </div>
        </div>

        {/* REST API Alternative */}
        <h2 className="text-xl font-bold text-white mb-4"># REST API Alternative</h2>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl mb-10">
          <p className="text-sm text-surface-400 mb-4">If you can&apos;t use MCP, our REST API provides the same functionality:</p>
          <div className="space-y-2 text-sm font-mono">
            <p><Badge variant="success" className="mr-2">GET</Badge><span className="text-white">/api/humans</span> <span className="text-surface-500">- Search humans</span></p>
            <p><Badge variant="success" className="mr-2">GET</Badge><span className="text-white">/api/humans/:id</span> <span className="text-surface-500">- Get human profile</span></p>
            <p><Badge variant="neon" className="mr-2">POST</Badge><span className="text-white">/api/bookings</span> <span className="text-surface-500">- Create booking</span></p>
          </div>
          <Link href="/api-docs" className="text-neon-400 text-sm hover:underline mt-4 inline-block">View full API documentation →</Link>
        </div>

        {/* Ready CTA */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl text-center !border-neon-500/20">
          <h3 className="text-lg font-bold text-white mb-2">ready to integrate?</h3>
          <p className="text-surface-400 text-sm mb-4">Add our MCP server to your AI agent and start booking humans today.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary">view on npm →</Button>
            <Link href="/browse"><Button variant="secondary">browse humans</Button></Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 px-6 mt-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-surface-500">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="OpenHuman" width={80} height={45} className="h-6 w-auto opacity-40" />
            <span>openhuman.app</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/browse" className="hover:text-white">browse</Link>
            <Link href="/bounties" className="hover:text-white">bounties</Link>
            <Link href="/api-docs" className="hover:text-white">api</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
