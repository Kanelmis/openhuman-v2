import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * WeChat Pay webhook - receives payment notifications
 * WeChat sends XML notifications for payment status changes
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    // Verify WeChat signature
    const apiKey = process.env.WECHAT_PAY_API_KEY;
    if (!apiKey) {
      console.error('WECHAT_PAY_API_KEY not configured');
      return NextResponse.json({ return_code: 'FAIL', return_msg: 'Server error' }, { status: 500 });
    }

    // Parse XML body (simplified - use xml2js in production)
    const getField = (field: string): string => {
      const match = body.match(new RegExp(`<${field}><!\\[CDATA\\[(.+?)\\]\\]></${field}>`));
      return match?.[1] || '';
    };

    const returnCode = getField('return_code');
    const resultCode = getField('result_code');
    const outTradeNo = getField('out_trade_no');
    const transactionId = getField('transaction_id');
    const totalFee = getField('total_fee');
    const sign = getField('sign');

    if (returnCode !== 'SUCCESS' || resultCode !== 'SUCCESS') {
      console.warn('WeChat payment failed:', { returnCode, resultCode, outTradeNo });
      return new Response(
        '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>',
        { headers: { 'Content-Type': 'application/xml' } }
      );
    }

    // Verify signature (simplified)
    const fields = body.match(/<(\w+)><!?\[?C?D?A?T?A?\[?(.+?)\]?\]?><\/\1>/g) || [];
    const params: Record<string, string> = {};
    for (const field of fields) {
      const m = field.match(/<(\w+)><!?\[?C?D?A?T?A?\[?(.+?)\]?\]?><\/\1>/);
      if (m && m[1] !== 'sign') params[m[1]] = m[2];
    }
    const sortedKeys = Object.keys(params).sort();
    const signStr = sortedKeys.map((k) => `${k}=${params[k]}`).join('&') + `&key=${apiKey}`;
    const expectedSign = crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();

    if (sign !== expectedSign) {
      console.error('WeChat signature mismatch', { outTradeNo });
      return new Response(
        '<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[Signature mismatch]]></return_msg></xml>',
        { headers: { 'Content-Type': 'application/xml' } }
      );
    }

    // Update payment in Firestore
    console.log('WeChat payment confirmed:', {
      orderId: outTradeNo,
      transactionId,
      amountCNY: Number(totalFee) / 100,
    });

    // TODO: Update booking payment status in Firestore
    // await updatePaymentStatus(outTradeNo, 'completed', { transactionId, provider: 'wechat' });

    return new Response(
      '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>',
      { headers: { 'Content-Type': 'application/xml' } }
    );
  } catch (error) {
    console.error('WeChat webhook error:', error);
    return new Response(
      '<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[Server error]]></return_msg></xml>',
      { headers: { 'Content-Type': 'application/xml' }, status: 500 }
    );
  }
}
