import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  if (currency === 'ETH' || currency === 'BTC' || currency === 'SOL') {
    return `${amount.toFixed(4)} ${currency}`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(date));
}

export function formatRelative(date: string | Date): string {
  const now = Date.now();
  const d = new Date(date).getTime();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function generateReferralCode(): string {
  return 'OH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    usdc_ethereum: 'USDC (Ethereum)',
    usdc_polygon: 'USDC (Polygon)',
    usdc_base: 'USDC (Base)',
    usdt_erc20: 'USDT (ERC-20)',
    usdt_trc20: 'USDT (TRC-20)',
    eth: 'Ethereum (ETH)',
    btc: 'Bitcoin (BTC)',
    sol: 'Solana (SOL)',
    matic: 'Polygon (MATIC)',
    wechat_pay: 'WeChat Pay 微信支付',
    alipay: 'Alipay 支付宝',
    unionpay: 'UnionPay 银联',
    bank_transfer: 'Bank Transfer 银行转账',
  };
  return labels[method] || method;
}

export function getChainExplorerUrl(chain: string, txHash: string): string {
  const explorers: Record<string, string> = {
    ethereum: `https://etherscan.io/tx/${txHash}`,
    polygon: `https://polygonscan.com/tx/${txHash}`,
    base: `https://basescan.org/tx/${txHash}`,
    solana: `https://solscan.io/tx/${txHash}`,
    bitcoin: `https://mempool.space/tx/${txHash}`,
    tron: `https://tronscan.org/#/transaction/${txHash}`,
  };
  return explorers[chain] || '#';
}
