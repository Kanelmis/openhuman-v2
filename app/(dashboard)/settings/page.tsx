'use client';

import React, { useState } from 'react';
import { Card, Button, Input, Select, Toggle } from '@/components/ui';

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);

  return (
    <div className="space-y-6">
      <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-2 font-semibold">Preferences</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>

      <Card>
        <h2 className="text-sm font-semibold text-white mb-4">Notifications</h2>
        <div className="space-y-4">
          <Toggle checked={emailNotifs} onChange={setEmailNotifs} label="Email notifications" />
          <Toggle checked={pushNotifs} onChange={setPushNotifs} label="Push notifications" />
          <Toggle checked={autoAccept} onChange={setAutoAccept} label="Auto-accept bookings from verified agents" />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-white mb-4">Language</h2>
        <Select className="w-48">
          <option>🇺🇸 English</option>
          <option>🇨🇳 中文</option>
          <option>🇪🇸 Español</option>
          <option>🇯🇵 日本語</option>
        </Select>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-white mb-4">Privacy</h2>
        <div className="space-y-3">
          <Toggle checked={true} onChange={() => {}} label="Show profile in browse" />
          <Toggle checked={true} onChange={() => {}} label="Allow agents to see my wallet" />
          <Toggle checked={false} onChange={() => {}} label="Hide location from public profile" />
        </div>
      </Card>

      <Card className="!border-red-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-400 font-semibold">Danger Zone</p>
            <p className="text-xs text-surface-500">permanently delete your account and all data</p>
          </div>
          <Button variant="danger" size="sm">delete account</Button>
        </div>
      </Card>
    </div>
  );
}
