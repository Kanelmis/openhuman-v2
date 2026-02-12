import { NextRequest } from 'next/server';
import { jsonResponse, jsonError, authenticateRequest, optionsResponse } from '@/lib/api/helpers';
import type { PaymentTransaction } from '@/types';

// CNY exchange rate (in production, fetch from API)
const USD_TO_CNY = 7.24;

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  try {
    const { bookingId, amount, tradeType = 'NATIVE' } = await req.json();

    if (!bookingId || !amount) {
      return jsonError('Missing required fields: bookingId, amount', 400);
    }

    const validTradeTypes = ['NATIVE', 'JSAPI', 'H5', 'APP'];
    if (!validTradeTypes.includes(tradeType)) {
      return jsonError(`Invalid tradeType. Supported: ${validTradeTypes.join(', ')}`, 400);
    }

    const cnyAmount = Math.round(amount * USD_TO_CNY * 100) / 100;

    const transaction: PaymentTransaction = {
      id: `wxpay_${Date.now()}`,
      bookingId,
      fromUserId: auth.userId,
      toUserId: 'platform-escrow',
      amount,
      currency: 'USD',
      method: 'wechat_pay',
      status: 'pending',
      metadata: {
        tradeType,
        cnyAmount,
        exchangeRate: USD_TO_CNY,
        platformFeePercent: 0.6,
        platformFee: amount * 0.006,
        mchId: process.env.WECHAT_MCH_ID || 'demo_mch_id',
      },
      createdAt: new Date().toISOString(),
    };

    // In production:
    // 1. Call WeChat Pay API to create prepay order
    // 2. Generate QR code URL or return prepay_id for JSAPI
    // 3. Store transaction in Firestore
    // 4. Return QR code or payment params to client

    const response: Record<string, unknown> = {
      transaction,
      cnyAmount,
      exchangeRate: USD_TO_CNY,
    };

    if (tradeType === 'NATIVE') {
      response.qrCodeUrl = `weixin://wxpay/bizpayurl?pr=${transaction.id}`;
      response.instructions = `Scan QR code with WeChat to pay ¥${cnyAmount}`;
    } else if (tradeType === 'JSAPI') {
      response.prepayId = `wx_prepay_${Date.now()}`;
      response.appId = process.env.WECHAT_APP_ID || 'demo_app_id';
    } else if (tradeType === 'H5') {
      response.h5Url = `https://wx.tenpay.com/cgi-bin/mmpayweb-bin/checkmweb?prepay_id=${transaction.id}`;
    }

    return jsonResponse(response, 201);
  } catch {
    return jsonError('Invalid request body', 400);
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
