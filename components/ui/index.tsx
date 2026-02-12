'use client';

import React from 'react';

/* ── Button ── */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'neon';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-xl';
  const sizes: Record<string, string> = {
    sm: 'px-3.5 py-1.5 text-[13px]',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };
  const variants: Record<string, string> = {
    primary: 'bg-neon-500 hover:bg-neon-400 text-surface-950 font-semibold shadow-[0_0_20px_rgba(0,230,118,0.25)] hover:shadow-[0_0_30px_rgba(0,230,118,0.4)]',
    secondary: 'bg-white/[0.06] hover:bg-white/[0.1] text-surface-200 border border-white/[0.1] hover:border-white/[0.15]',
    ghost: 'text-surface-400 hover:text-white hover:bg-white/[0.05]',
    danger: 'bg-red-500/10 hover:bg-red-500/15 text-red-400 border border-red-500/20',
    neon: 'bg-transparent border border-neon-500/40 text-neon-400 hover:bg-neon-500/10 shadow-[0_0_15px_rgba(0,230,118,0.1)]',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/* ── Card ── */
type CardProps = React.HTMLAttributes<HTMLDivElement> & { glow?: boolean };

export function Card({ className = '', glow, children, ...props }: CardProps) {
  return (
    <div
      className={`bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 ${glow ? 'border-neon-500/15 shadow-[0_0_20px_rgba(0,230,118,0.06)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Input ── */
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs text-surface-400 mb-1.5 font-medium">{label}</label>}
      <input
        className={`w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-500 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}

/* ── Textarea ── */
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string };

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs text-surface-400 mb-1.5 font-medium">{label}</label>}
      <textarea
        className={`w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-500 transition-colors resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

/* ── Select ── */
type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string };

export function Select({ label, className = '', children, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs text-surface-400 mb-1.5 font-medium">{label}</label>}
      <select
        className={`w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white transition-colors appearance-none ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

/* ── Badge ── */
type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'neon';
};

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-neon-500/10 text-neon-400 border-neon-500/20',
    secondary: 'bg-white/[0.05] text-surface-300 border-white/[0.08]',
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    neon: 'bg-neon-500/15 text-neon-400 border-neon-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}

/* ── Avatar ── */
type AvatarProps = { src?: string; name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string };

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const sizes: Record<string, string> = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl',
  };
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  if (src) return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover border border-white/10 ${className}`} />;
  return (
    <div className={`${sizes[size]} rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-surface-300 font-medium ${className}`}>
      {initials}
    </div>
  );
}

/* ── Skeleton ── */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white/[0.06] rounded-xl ${className}`} />;
}

/* ── Toggle ── */
type ToggleProps = { checked: boolean; onChange: (checked: boolean) => void; label?: string };

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button type="button" role="switch" aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-neon-500 shadow-[0_0_10px_rgba(0,230,118,0.3)]' : 'bg-white/[0.1]'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
      {label && <span className="text-sm text-surface-300">{label}</span>}
    </label>
  );
}

/* ── Tabs ── */
type TabsProps = { tabs: { key: string; label: string }[]; active: string; onChange: (key: string) => void };

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex bg-white/[0.03] border border-white/[0.06] rounded-2xl p-1.5 gap-1">
      {tabs.map((tab) => (
        <button key={tab.key} onClick={() => onChange(tab.key)}
          className={`flex-1 px-4 py-2.5 text-sm rounded-xl transition-all ${
            active === tab.key
              ? 'bg-neon-500 text-surface-950 font-semibold shadow-[0_0_15px_rgba(0,230,118,0.25)]'
              : 'text-surface-400 hover:text-white hover:bg-white/[0.05]'
          }`}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
