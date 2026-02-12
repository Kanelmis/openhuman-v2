import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Alipay webhook - receives async payment notifications
 * Alipay sends form-encoded POST requests
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    const { sign, sign_type, ...verifyParams } = params;

    // Verify RSA2 signature
    const alipayPublicKey = process.env.ALIPAY_PUBLIC_KEY;
    if (!alipayPublicKey) {
      console.error('ALIPAY_PUBLIC_KEY not configured');
      return new Response('failure', { status: 500 });
    }

    // Build verification string
    const sortedKeys = Object.keys(verifyParams).sort();
    const signStr = sortedKeys.map((k) => `${k}=${verifyParams[k]}`).join('&');

    // Verify signature (RSA2-SHA256)
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(signStr);
    const isValid = verifier.verify(
      `-----BEGIN PUBLIC KEY-----\n${alipayPublicKey}\n-----END PUBLIC KEY-----`,
      sign,
      'base64'
    );

    if (!isValid) {
      console.error('Alipay signature verification failed', { out_trade_no: params.out_trade_no });
      return new Response('failure');
    }

    const tradeStatus = params.trade_status;
    const outTradeNo = params.out_trade_no;
    const tradeNo = params.trade_no;
    const totalAmount = params.total_amount;

    if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
      console.log('Alipay payment confirmed:', {
        orderId: outTradeNo,
        tradeNo,
        amountCNY: totalAmount,
      });

      // TODO: Update booking payment status in Firestore
      // await updatePaymentStatus(outTradeNo, 'completed', { tradeNo, provider: 'alipay' });
    } else {
      console.warn('Alipay trade status:', tradeStatus, { outTradeNo });
    }

    // Alipay expects "success" text response
    return new Response('success');
  } catch (error) {
    console.error('Alipay webhook error:', error);
    return new Response('failure', { status: 500 });
  }
}
