import { NextRequest } from 'next/server';
import { jsonResponse, jsonError, authenticateRequest, optionsResponse } from '@/lib/api/helpers';
import type { PaymentTransaction } from '@/types';

const USD_TO_CNY = 7.24;

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  try {
    const { bookingId, amount } = await req.json();

    if (!bookingId || !amount) {
      return jsonError('Missing required fields: bookingId, amount', 400);
    }

    const cnyAmount = Math.round(amount * USD_TO_CNY * 100) / 100;

    const transaction: PaymentTransaction = {
      id: `ali_${Date.now()}`,
      bookingId,
      fromUserId: auth.userId,
      toUserId: 'platform-escrow',
      amount,
      currency: 'USD',
      method: 'alipay',
      status: 'pending',
      metadata: {
        cnyAmount,
        exchangeRate: USD_TO_CNY,
        platformFeePercent: 0.6,
        platformFee: amount * 0.006,
      },
      createdAt: new Date().toISOString(),
    };

    // In production:
    // 1. Call Alipay precreate API (alipay.trade.precreate)
    // 2. Return QR code string
    // 3. Store transaction in Firestore
    // 4. Poll or wait for async notification

    return jsonResponse({
      transaction,
      cnyAmount,
      exchangeRate: USD_TO_CNY,
      qrCode: `https://qr.alipay.com/${transaction.id}`,
      instructions: `Scan QR code with Alipay to pay ¥${cnyAmount}`,
    }, 201);
  } catch {
    return jsonError('Invalid request body', 400);
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
