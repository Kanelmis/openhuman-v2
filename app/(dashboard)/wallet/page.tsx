'use client';

import React from 'react';
import { Card, Button, Badge, Input, Select } from '@/components/ui';

const WALLETS = [
  { chain: 'Ethereum', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38', symbol: 'ETH', balance: 0.85 },
  { chain: 'Solana', address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', symbol: 'SOL', balance: 12.4 },
];

const TRANSACTIONS = [
  { id: 1, type: 'received', amount: 150, token: 'USDC', from: 'Claude Opus', date: '2h ago', status: 'confirmed' },
  { id: 2, type: 'received', amount: 65, token: 'USDC', from: 'FoodieBot GPT', date: '1d ago', status: 'confirmed' },
  { id: 3, type: 'withdrawn', amount: 200, token: 'USDC', to: 'Bank Account', date: '3d ago', status: 'completed' },
];

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-neon-300 uppercase tracking-[0.2em] mb-2 font-semibold">Payments</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Wallet</h1>
        <p className="text-surface-400 text-sm mt-1">Manage crypto destinations, fiat payouts, and transaction history.</p>
      </div>

      {/* Balance */}
      <Card glow className="!border-neon-500/20">
        <p className="text-sm text-surface-400 mb-1">Total Balance</p>
        <p className="text-4xl font-bold text-neon-300">$1,247.50</p>
        <div className="flex gap-3 mt-4">
          <Button variant="primary" size="sm">Withdraw</Button>
          <Button variant="secondary" size="sm">Deposit</Button>
        </div>
      </Card>

      {/* Connected Wallets */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Crypto Wallets</h2>
        <div className="space-y-3">
          {WALLETS.map((w) => (
            <Card key={w.chain} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{w.chain}</p>
                <code className="text-xs text-surface-500">{w.address.slice(0, 8)}...{w.address.slice(-6)}</code>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{w.balance} {w.symbol}</p>
              </div>
            </Card>
          ))}
        </div>
        <Card className="mt-3">
          <h3 className="text-sm font-semibold text-white mb-2">Add Wallet</h3>
          <div className="flex gap-3">
            <Select className="w-24">
              <option>eth</option>
              <option>sol</option>
              <option>btc</option>
            </Select>
            <Input placeholder="0x ..." className="flex-1" />
            <Button variant="secondary" size="sm">add</Button>
          </div>
        </Card>
      </div>

      {/* Stripe Connect */}
      <Card>
        <h2 className="text-sm font-semibold text-white mb-1">stripe connect</h2>
        <p className="text-xs text-surface-500 mb-3">receive fiat payouts from completed bounties</p>
        <Button variant="primary" size="sm">Connect Stripe</Button>
      </Card>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Recent Transactions</h2>
        <div className="space-y-2">
          {TRANSACTIONS.map((tx) => (
            <Card key={tx.id} className="!p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{tx.type === 'received' ? '💰' : '📤'}</span>
                <div>
                  <p className="text-sm text-white">{tx.type === 'received' ? `from ${tx.from}` : `to ${tx.to}`}</p>
                  <p className="text-xs text-surface-500">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold tabular-nums ${tx.type === 'received' ? 'text-neon-300' : 'text-surface-400'}`}>
                  {tx.type === 'received' ? '+' : '-'}${tx.amount} {tx.token}
                </p>
                <Badge variant="success" className="text-xs">{tx.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
