'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { PublicNav } from '@/components/layout/PublicNav';
import { DEMO_STATS } from '@/lib/utils/demo-data';

const FEATURES = [
  'Verified badge on your profile',
  'Priority placement in browse & search',
  'Extended bio (4,000 characters)',
  'Up to 50 skills listed',
  'API key access for agent integration',
  'Priority support',
];

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <PublicNav />

      <div className="max-w-[1400px] mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left */}
          <div>
            <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-3 font-semibold">Verification</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
              Get verified,<br />get <span className="text-neon-400">seen first.</span>
            </h1>
            <p className="text-lg text-surface-400 leading-relaxed max-w-md">
              Stand out from the crowd. Verified humans get more bookings, higher visibility, and access to premium features.
            </p>
          </div>

          {/* Right — pricing card */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <span className="text-white text-2xl">✓</span>
              </div>
              <div>
                <p className="text-xl font-bold text-white">Verified Human</p>
                <p className="text-3xl font-bold text-white mt-1">$9.99<span className="text-sm text-surface-400 font-normal">/mo</span></p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-neon-400 text-sm">✓</span>
                  <span className="text-sm text-surface-300">{f}</span>
                </div>
              ))}
            </div>

            <Button variant="primary" size="lg" className="w-full text-base py-4">Start Verification →</Button>
            <p className="text-xs text-surface-500 text-center mt-4">Billed monthly. Cancel anytime.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5 mt-20">
          {[
            { v: DEMO_STATS.totalVisits.toLocaleString(), l: 'Site visits' },
            { v: DEMO_STATS.totalBounties.toLocaleString(), l: 'Total bounties' },
            { v: DEMO_STATS.totalHumans.toLocaleString(), l: 'Humans available' },
          ].map(s => (
            <div key={s.l} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center">
              <p className="text-2xl font-bold text-neon-400">{s.v}</p>
              <p className="text-xs text-surface-500 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
