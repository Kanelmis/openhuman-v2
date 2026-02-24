'use client';

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'neon';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border';
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-[13px]',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variants: Record<string, string> = {
    primary: 'bg-neon-500 hover:bg-neon-400 border-neon-500/70 text-surface-950 font-semibold shadow-[0_8px_20px_rgba(16,185,129,0.25)]',
    secondary: 'bg-white/[0.04] hover:bg-white/[0.07] text-surface-200 border-white/[0.12]',
    ghost: 'bg-transparent border-transparent text-surface-400 hover:text-white hover:bg-white/[0.05]',
    danger: 'bg-red-500/12 hover:bg-red-500/18 text-red-300 border-red-500/30',
    neon: 'bg-neon-500/[0.08] border-neon-500/30 text-neon-400 hover:bg-neon-500/[0.14]',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

type CardProps = React.HTMLAttributes<HTMLDivElement> & { glow?: boolean };

export function Card({ className = '', glow, children, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface-900/70 border border-white/[0.1] rounded-2xl p-5 shadow-[0_8px_30px_rgba(2,6,23,0.24)] backdrop-blur-sm ${glow ? 'border-neon-500/30 shadow-[0_10px_30px_rgba(16,185,129,0.18)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs text-surface-400 mb-1.5 font-medium">{label}</label>}
      <input
        className={`w-full bg-surface-900/80 border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-sm text-surface-100 placeholder:text-surface-500 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string };

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs text-surface-400 mb-1.5 font-medium">{label}</label>}
      <textarea
        className={`w-full bg-surface-900/80 border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-sm text-surface-100 placeholder:text-surface-500 transition-colors resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string };

export function Select({ label, className = '', children, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs text-surface-400 mb-1.5 font-medium">{label}</label>}
      <select
        className={`w-full bg-surface-900/80 border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-sm text-surface-100 transition-colors appearance-none ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'neon';
};

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-neon-500/10 text-neon-300 border-neon-500/30',
    secondary: 'bg-white/[0.04] text-surface-300 border-white/[0.12]',
    success: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/12 text-amber-300 border-amber-500/30',
    danger: 'bg-red-500/12 text-red-300 border-red-500/30',
    neon: 'bg-neon-500/15 text-neon-300 border-neon-500/35',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}

type AvatarProps = { src?: string; name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string };

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const sizes: Record<string, string> = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl',
  };
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  // eslint-disable-next-line @next/next/no-img-element
  if (src) return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover border border-white/15 ${className}`} />;
  return (
    <div className={`${sizes[size]} rounded-full bg-surface-800 border border-white/15 flex items-center justify-center text-surface-200 font-medium ${className}`}>
      {initials}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white/[0.08] rounded-xl ${className}`} />;
}

type ToggleProps = { checked: boolean; onChange: (checked: boolean) => void; label?: string };

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button type="button" role="switch" aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border ${checked ? 'bg-neon-500 border-neon-500/70 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]' : 'bg-white/[0.08] border-white/[0.18]'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
      {label && <span className="text-sm text-surface-300">{label}</span>}
    </label>
  );
}

type TabsProps = { tabs: { key: string; label: string }[]; active: string; onChange: (key: string) => void };

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex bg-surface-900/70 border border-white/[0.1] rounded-2xl p-1 gap-1">
      {tabs.map((tab) => (
        <button key={tab.key} onClick={() => onChange(tab.key)}
          className={`flex-1 px-4 py-2 text-sm rounded-xl transition-all ${
            active === tab.key
              ? 'bg-white/[0.14] text-white font-semibold border border-white/[0.2]'
              : 'text-surface-400 hover:text-white hover:bg-white/[0.06]'
          }`}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
