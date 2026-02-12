'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Button, Badge, Input, Textarea, Select, Toggle, Tabs, Avatar } from '@/components/ui';
import { DEMO_USERS } from '@/lib/utils/demo-data';

const PROFILE_TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'photos', label: 'Photos' },
  { key: 'payments', label: 'Payments' },
  { key: 'messages', label: 'Messages' },
  { key: 'api_keys', label: 'API Keys' },
];

const CHECKLIST = [
  { id: 'name', label: 'Add your name', done: true },
  { id: 'skill', label: 'Add at least one skill', done: false },
  { id: 'city', label: 'Add your city (e.g. San Francisco)', done: false },
  { id: 'payment', label: 'Add a payment method', done: false },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [available, setAvailable] = useState(true);
  const user = DEMO_USERS[0];

  return (
    <div className="space-y-6">
      {/* Profile Completion */}
      <Card className="!border-accent-400/30">
        <h2 className="text-base font-semibold text-accent-500 mb-2">Complete your profile</h2>
        <p className="text-sm text-surface-400 mb-3">Finish these steps to start receiving bookings:</p>
        <div className="space-y-1.5">
          {CHECKLIST.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className={`text-sm ${item.done ? 'text-green-400' : 'text-surface-600'}`}>
                {item.done ? '✓' : '○'}
              </span>
              <span className={`text-sm ${item.done ? 'text-surface-500 line-through' : 'text-surface-300'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Get Verified CTA */}
      <Card className="!border-neon-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-blue-400 text-xl">✓</span>
          <div>
            <p className="text-sm font-semibold text-white">Get Verified</p>
            <p className="text-xs text-surface-400">Blue checkmark + priority listing for $9.99/month</p>
          </div>
        </div>
        <Link href="/verify"><Button variant="primary" size="sm">Get Verified →</Button></Link>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-white">1</p>
          <p className="text-xs text-surface-500 mt-1">Profile views</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-neon-400">0</p>
          <p className="text-xs text-surface-500 mt-1">AI inbounds</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-accent-400">—</p>
          <p className="text-xs text-surface-500 mt-1">Rating</p>
        </Card>
      </div>

      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-2 font-semibold">Home</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <Button variant="primary" size="sm">Save</Button>
      </div>

      <Tabs tabs={PROFILE_TABS} active={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/[0.06] border-2 border-dashed border-white/[0.12] flex items-center justify-center text-surface-500 text-xs cursor-pointer hover:border-neon-500/50 transition-colors">
                add
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{user.name}</p>
                <p className="text-sm text-surface-500">{user.email || 'user@openhuman.app'}</p>
                <p className="text-sm text-neon-400">available</p>
              </div>
            </div>
          </Card>

          <Card className="!border-accent-400/30 flex items-center justify-between !py-3">
            <p className="text-sm text-accent-400">Add your gender to help renters find you</p>
            <Button variant="ghost" size="sm" className="text-accent-400">Set now ↓</Button>
          </Card>

          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input label="Name" defaultValue={user.name} />
              <Input label="Headline" placeholder="What you do" />
              <Select label="Gender">
                <option value="">Select...</option>
                <option value="man">Man</option>
                <option value="woman">Woman</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <Textarea label="Bio" placeholder="Tell agents about yourself..." rows={4} />
            <p className="text-xs text-surface-600 mt-1 text-right">0/2000</p>
            <p className="text-xs text-surface-500 mt-1">
              <Link href="/verify" className="text-neon-400 hover:underline">Verify</Link> to increase bio limit to 4,000 characters
            </p>
          </Card>

          <Card className="!border-accent-400/30">
            <div className="flex items-center gap-2 mb-4">
              <span>📍</span>
              <h3 className="text-sm font-semibold text-white">Location</h3>
              <Badge variant="warning" className="text-xs">Important — helps agents find you</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="City" placeholder="San Francisco" />
              <Input label="State / Region" placeholder="California" />
              <Input label="Country" placeholder="United States" />
            </div>
          </Card>

          <Card className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Available</h3>
              <p className="text-xs text-surface-500">Accepting bookings?</p>
            </div>
            <Toggle checked={available} onChange={setAvailable} />
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Hourly Rate</h3>
                <p className="text-xs text-surface-500">What you charge per hour</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neon-400 text-2xl font-bold">$</span>
                <Input type="number" defaultValue={50} className="w-24 text-center !text-lg" />
                <span className="text-surface-500 text-sm">/hr</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-white mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {user.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-white/[0.05] border border-neon-500/30 rounded-lg text-xs text-neon-400">
                  {skill}
                </span>
              ))}
            </div>
            <Input placeholder="Add a skill..." />
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-white mb-3">Social Links</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm w-6 text-center">𝕏</span>
                <Input placeholder="@username" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm w-6 text-center">📷</span>
                <Input placeholder="@username" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm w-6 text-center">▶</span>
                <Input placeholder="@channel" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold text-white mb-1">Photos</h3>
            <p className="text-xs text-surface-500 mb-4">Up to 5 extra pics</p>
            <div className="border-2 border-dashed border-white/[0.1] rounded-xl p-12 text-center cursor-pointer hover:border-neon-500/30 transition-colors">
              <p className="text-sm text-surface-400">Click to upload</p>
              <p className="text-xs text-surface-600 mt-1">jpg/png, 5mb max</p>
            </div>
          </Card>
          <Card className="!border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-400 font-semibold">Danger Zone</p>
                <p className="text-xs text-surface-500">Permanently delete your profile and all associated data</p>
              </div>
              <Button variant="danger" size="sm">Delete Profile</Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold text-white mb-1">Stripe Connect</h3>
            <p className="text-xs text-surface-500 mb-4">Receive payouts from completed bounties</p>
            <div className="border-2 border-dashed border-white/[0.1] rounded-xl p-8 text-center">
              <p className="text-sm text-white mb-2">Get paid for your work</p>
              <p className="text-xs text-surface-400 mb-4">Connect your bank account or debit card through Stripe to receive payouts when you complete bounties. Takes about 5 minutes.</p>
              <Button variant="primary" size="sm">Start Setup</Button>
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-white mb-1">Crypto Wallets</h3>
            <p className="text-xs text-surface-500 mb-4">Where agents send crypto payment</p>
            <div className="flex items-center gap-3 mb-4">
              <Select className="w-24">
                <option>ETH</option>
                <option>SOL</option>
                <option>BTC</option>
                <option>USDC</option>
                <option>USDT</option>
              </Select>
              <Input placeholder="0x ..." className="flex-1 font-mono text-xs" />
              <Button variant="secondary" size="sm">Add</Button>
            </div>
            <p className="text-center text-surface-600 text-sm">No wallets yet</p>
          </Card>
        </div>
      )}

      {activeTab === 'messages' && (
        <Card className="min-h-[400px]">
          <h3 className="text-sm font-semibold text-white mb-1">Messages</h3>
          <p className="text-xs text-surface-500 mb-6">Conversations with agents & applicants</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[300px]">
            <div className="border-r border-white/[0.06] pr-4">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <span className="text-3xl mb-2">💬</span>
                <p className="text-sm text-surface-500">No messages yet</p>
                <p className="text-xs text-surface-600">AI agents will contact you here</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-3xl mb-2">💬</span>
              <p className="text-sm text-surface-500">Select a conversation</p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'api_keys' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold text-white mb-1">API Keys</h3>
            <p className="text-xs text-surface-500 mb-6">Generate keys for AI agents to use the OpenHuman API</p>
            <div className="flex flex-col items-center justify-center py-8">
              <span className="text-4xl mb-3">🔒</span>
              <p className="text-sm text-white mb-1">Verification Required</p>
              <p className="text-xs text-surface-500 mb-4">API keys are only available to verified users</p>
              <Link href="/verify"><Button variant="neon" size="sm">Get Verified</Button></Link>
            </div>
          </Card>
          <Card className="!border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-400 font-semibold">Danger Zone</p>
                <p className="text-xs text-surface-500">Permanently delete your profile and all associated data</p>
              </div>
              <Button variant="danger" size="sm">Delete Profile</Button>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-4">
        <Card className="text-center">
          <p className="text-lg font-bold text-accent-400">—</p>
          <p className="text-xs text-surface-500">Rating</p>
        </Card>
        <Card className="text-center">
          <p className="text-lg font-bold text-neon-400">0</p>
          <p className="text-xs text-surface-500">Reviews</p>
        </Card>
      </div>
    </div>
  );
}
