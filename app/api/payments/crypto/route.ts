import { NextRequest } from 'next/server';
import { jsonResponse, jsonError, authenticateRequest, optionsResponse } from '@/lib/api/helpers';
import type { PaymentTransaction, PaymentMethod } from '@/types';

const CRYPTO_METHODS: PaymentMethod[] = [
  'usdc_ethereum', 'usdc_polygon', 'usdc_base',
  'usdt_erc20', 'usdt_trc20',
  'eth', 'btc', 'sol', 'matic',
];

const PLATFORM_WALLETS: Record<string, string> = {
  ethereum: process.env.PLATFORM_ETH_WALLET || '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
  polygon: process.env.PLATFORM_POLYGON_WALLET || '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
  base: process.env.PLATFORM_BASE_WALLET || '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
  solana: process.env.PLATFORM_SOL_WALLET || '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV',
  bitcoin: process.env.PLATFORM_BTC_WALLET || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  tron: process.env.PLATFORM_TRON_WALLET || 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9',
};

function getChainForMethod(method: PaymentMethod): string {
  if (method.includes('polygon') || method === 'matic') return 'polygon';
  if (method.includes('base')) return 'base';
  if (method === 'sol') return 'solana';
  if (method === 'btc') return 'bitcoin';
  if (method === 'usdt_trc20') return 'tron';
  return 'ethereum';
}

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  try {
    const { bookingId, amount, currency, method, fromWallet } = await req.json();

    if (!bookingId || !amount || !method) {
      return jsonError('Missing required fields: bookingId, amount, method', 400);
    }

    if (!CRYPTO_METHODS.includes(method)) {
      return jsonError(`Invalid payment method. Supported: ${CRYPTO_METHODS.join(', ')}`, 400);
    }

    if (amount <= 0) {
      return jsonError('Amount must be positive', 400);
    }

    const chain = getChainForMethod(method);
    const platformWallet = PLATFORM_WALLETS[chain];

    const transaction: PaymentTransaction = {
      id: `pay_${Date.now()}`,
      bookingId,
      fromUserId: auth.userId,
      toUserId: 'platform-escrow',
      amount,
      currency: currency || 'USD',
      method,
      status: 'pending',
      walletAddress: platformWallet,
      metadata: {
        chain,
        fromWallet: fromWallet || null,
        platformFeePercent: 5,
        platformFee: amount * 0.05,
        humanPayout: amount * 0.95,
      },
      createdAt: new Date().toISOString(),
    };

    // In production:
    // 1. Create escrow transaction in Firestore
    // 2. Generate payment address or initiate on-chain tx
    // 3. Monitor blockchain for confirmation
    // 4. Update booking payment status

    return jsonResponse({
      transaction,
      payTo: {
        chain,
        address: platformWallet,
        amount,
        currency: method.includes('usdc') ? 'USDC' : method.includes('usdt') ? 'USDT' : method.toUpperCase(),
      },
      instructions: `Send ${amount} to ${platformWallet} on ${chain}. Transaction will be confirmed after blockchain verification.`,
    }, 201);
  } catch {
    return jsonError('Invalid request body', 400);
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
