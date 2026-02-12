'use client';

import React, { useState } from 'react';
import { Card, Button, Badge } from '@/components/ui';

const METHODS = [
  { id: 'stripe', name: 'Stripe Connect', desc: 'Bank / debit card payouts', icon: '💳' },
  { id: 'usdc', name: 'USDC', desc: 'Stablecoin on Ethereum/Solana', icon: '💰' },
  { id: 'eth', name: 'Ethereum', desc: 'ETH payments', icon: '⟠' },
  { id: 'sol', name: 'Solana', desc: 'SOL payments', icon: '◎' },
];

export function PaymentMethodSelector() {
  const [selected, setSelected] = useState('stripe');

  return (
    <div className="space-y-3">
      {METHODS.map((m) => (
        <button
          key={m.id}
          onClick={() => setSelected(m.id)}
          className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
            selected === m.id
              ? 'border-neon-500 bg-neon-500/5'
              : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.12]'
          }`}
        >
          <span className="text-xl">{m.icon}</span>
          <div className="text-left flex-1">
            <p className="text-sm text-white font-medium">{m.name}</p>
            <p className="text-xs text-surface-500">{m.desc}</p>
          </div>
          {selected === m.id && <span className="text-neon-400 text-lg">✓</span>}
        </button>
      ))}
      <Card className="bg-neon-600/5 border-neon-500/20">
        <p className="text-xs text-surface-400">Selected: <span className="text-neon-400 font-semibold">{METHODS.find(m => m.id === selected)?.name}</span></p>
      </Card>
    </div>
  );
}
