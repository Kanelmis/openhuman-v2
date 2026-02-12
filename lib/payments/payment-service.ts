import type { PaymentMethod, PaymentTransaction, PaymentStatus } from '@/types';

// ==================== PAYMENT SERVICE ====================

interface PaymentRequest {
  amount: number;
  currency: string;
  method: PaymentMethod;
  fromUserId: string;
  toUserId: string;
  bookingId: string;
  metadata?: Record<string, unknown>;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  txHash?: string;
  qrCodeUrl?: string;
  walletAddress?: string;
  error?: string;
  status: PaymentStatus;
}

// Exchange rate cache
const exchangeRates: Record<string, { rate: number; timestamp: number }> = {};

async function getExchangeRate(from: string, to: string): Promise<number> {
  const key = `${from}_${to}`;
  const cached = exchangeRates[key];
  if (cached && Date.now() - cached.timestamp < 300000) return cached.rate; // 5min cache

  // In production, call a real exchange rate API
  const mockRates: Record<string, number> = {
    USD_CNY: 7.24,
    USD_ETH: 0.00029,
    USD_BTC: 0.0000098,
    USD_SOL: 0.0042,
    USD_MATIC: 0.89,
  };

  const rate = mockRates[key] || 1;
  exchangeRates[key] = { rate, timestamp: Date.now() };
  return rate;
}

// ==================== CRYPTO PAYMENTS ====================

export async function processCryptoPayment(request: PaymentRequest): Promise<PaymentResult> {
  const { method, amount } = request;

  // Determine chain and wallet
  const chainConfig = getCryptoChainConfig(method);
  if (!chainConfig) {
    return { success: false, error: 'Unsupported crypto payment method', status: 'failed' };
  }

  // Generate payment address (in production, generate unique deposit addresses)
  const walletAddress = chainConfig.platformWallet;

  // Convert amount if needed
  let cryptoAmount = amount;
  if (!method.startsWith('usdc') && !method.startsWith('usdt')) {
    const rate = await getExchangeRate('USD', chainConfig.symbol);
    cryptoAmount = amount * rate;
  }

  return {
    success: true,
    walletAddress,
    status: 'pending',
    transactionId: `crypto_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  };
}

function getCryptoChainConfig(method: PaymentMethod) {
  const configs: Record<string, { chain: string; symbol: string; platformWallet: string; decimals: number }> = {
    usdc_ethereum: {
      chain: 'ethereum',
      symbol: 'USDC',
      platformWallet: process.env.PLATFORM_WALLET_ETHEREUM || '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
      decimals: 6,
    },
    usdc_polygon: {
      chain: 'polygon',
      symbol: 'USDC',
      platformWallet: process.env.PLATFORM_WALLET_ETHEREUM || '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
      decimals: 6,
    },
    usdc_base: {
      chain: 'base',
      symbol: 'USDC',
      platformWallet: process.env.PLATFORM_WALLET_ETHEREUM || '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
      decimals: 6,
    },
    usdt_erc20: {
      chain: 'ethereum',
      symbol: 'USDT',
      platformWallet: process.env.PLATFORM_WALLET_ETHEREUM || '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
      decimals: 6,
    },
    usdt_trc20: {
      chain: 'tron',
      symbol: 'USDT',
      platformWallet: process.env.PLATFORM_WALLET_TRON || 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9',
      decimals: 6,
    },
    eth: {
      chain: 'ethereum',
      symbol: 'ETH',
      platformWallet: process.env.PLATFORM_WALLET_ETHEREUM || '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
      decimals: 18,
    },
    btc: {
      chain: 'bitcoin',
      symbol: 'BTC',
      platformWallet: process.env.PLATFORM_WALLET_BITCOIN || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      decimals: 8,
    },
    sol: {
      chain: 'solana',
      symbol: 'SOL',
      platformWallet: process.env.PLATFORM_WALLET_SOLANA || '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV',
      decimals: 9,
    },
    matic: {
      chain: 'polygon',
      symbol: 'MATIC',
      platformWallet: process.env.PLATFORM_WALLET_ETHEREUM || '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
      decimals: 18,
    },
  };
  return configs[method] || null;
}

// ==================== WECHAT PAY ====================

export async function processWeChatPayment(request: PaymentRequest): Promise<PaymentResult> {
  const cnyAmount = request.amount * (await getExchangeRate('USD', 'CNY'));

  // In production, call WeChat Pay API
  // POST https://api.mch.weixin.qq.com/v3/pay/transactions/native
  const mockOrderId = `wx_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const qrCodeUrl = `weixin://wxpay/bizpayurl?pr=${mockOrderId}`;

  return {
    success: true,
    transactionId: mockOrderId,
    qrCodeUrl,
    status: 'pending',
  };
}

// ==================== ALIPAY ====================

export async function processAlipayPayment(request: PaymentRequest): Promise<PaymentResult> {
  const cnyAmount = request.amount * (await getExchangeRate('USD', 'CNY'));

  // In production, call Alipay API
  // alipay.trade.precreate
  const mockOrderId = `ali_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const qrCodeUrl = `https://qr.alipay.com/${mockOrderId}`;

  return {
    success: true,
    transactionId: mockOrderId,
    qrCodeUrl,
    status: 'pending',
  };
}

// ==================== UNIFIED PAYMENT PROCESSOR ====================

export async function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  const { method } = request;

  if (method === 'wechat_pay') return processWeChatPayment(request);
  if (method === 'alipay') return processAlipayPayment(request);
  if (method === 'unionpay' || method === 'bank_transfer') {
    return { success: false, error: 'Bank transfer requires manual processing', status: 'pending' };
  }

  // All crypto methods
  return processCryptoPayment(request);
}

export async function verifyPayment(transactionId: string, method: PaymentMethod): Promise<boolean> {
  // In production, verify with respective payment provider or check on-chain
  // For now, return pending
  return false;
}

// ==================== PAYMENT METHOD GROUPS ====================

export const PAYMENT_METHODS = {
  crypto: [
    { id: 'usdc_ethereum' as const, label: 'USDC (Ethereum)', icon: '💎', fee: '~$5-15', speed: '~2 min' },
    { id: 'usdc_polygon' as const, label: 'USDC (Polygon)', icon: '🟣', fee: '~$0.01', speed: '~5 sec' },
    { id: 'usdc_base' as const, label: 'USDC (Base)', icon: '🔵', fee: '~$0.01', speed: '~2 sec' },
    { id: 'usdt_trc20' as const, label: 'USDT (TRC-20)', icon: '🟢', fee: '~$1', speed: '~3 sec', recommended: true },
    { id: 'usdt_erc20' as const, label: 'USDT (ERC-20)', icon: '💚', fee: '~$5-15', speed: '~2 min' },
    { id: 'eth' as const, label: 'Ethereum', icon: '⟠', fee: '~$5-15', speed: '~2 min' },
    { id: 'btc' as const, label: 'Bitcoin', icon: '₿', fee: '~$1-5', speed: '~10 min' },
    { id: 'sol' as const, label: 'Solana', icon: '◎', fee: '~$0.001', speed: '~0.4 sec' },
    { id: 'matic' as const, label: 'Polygon', icon: '🟣', fee: '~$0.01', speed: '~5 sec' },
  ],
  chinese: [
    { id: 'wechat_pay' as const, label: '微信支付 WeChat Pay', icon: '💬', fee: '0.6%', speed: 'instant' },
    { id: 'alipay' as const, label: '支付宝 Alipay', icon: '🅰️', fee: '0.6%', speed: 'instant' },
    { id: 'unionpay' as const, label: '银联 UnionPay', icon: '🏦', fee: '0.5%', speed: '1-2 days' },
    { id: 'bank_transfer' as const, label: '银行转账 Bank Transfer', icon: '🏧', fee: 'varies', speed: '1-3 days' },
  ],
};
