import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Crypto payment webhook - receives blockchain payment confirmations
 * Handles on-chain transaction verification for USDC, USDT, ETH, BTC, SOL
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verify webhook signature (from our own monitoring service or a provider like Alchemy/Moralis)
    const signature = req.headers.get('x-webhook-signature');
    const webhookSecret = process.env.CRYPTO_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const expectedSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(body))
        .digest('hex');

      if (signature !== expectedSig) {
        console.error('Crypto webhook signature mismatch');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const {
      event_type,
      transaction_hash,
      chain,
      from_address,
      to_address,
      amount,
      token,
      confirmations,
      order_id,
    } = body;

    switch (event_type) {
      case 'payment.detected': {
        console.log('Crypto payment detected:', { transaction_hash, chain, amount, token, order_id });
        // Payment seen on-chain but not yet confirmed
        // TODO: Update status to 'processing'
        break;
      }

      case 'payment.confirmed': {
        console.log('Crypto payment confirmed:', {
          transaction_hash,
          chain,
          amount,
          token,
          confirmations,
          order_id,
        });

        // Verify minimum confirmations per chain
        const minConfirmations: Record<string, number> = {
          ethereum: 12,
          polygon: 30,
          base: 12,
          solana: 32,
          bitcoin: 3,
          tron: 20,
        };

        const required = minConfirmations[chain] || 12;
        if (confirmations < required) {
          console.warn(`Insufficient confirmations: ${confirmations}/${required} for ${chain}`);
          return NextResponse.json({ status: 'waiting_confirmations', required, current: confirmations });
        }

        // Verify receiving address matches our platform wallet
        const platformWallets: Record<string, string | undefined> = {
          ethereum: process.env.PLATFORM_ETH_WALLET,
          polygon: process.env.PLATFORM_ETH_WALLET,
          base: process.env.PLATFORM_ETH_WALLET,
          solana: process.env.PLATFORM_SOL_WALLET,
          bitcoin: process.env.PLATFORM_BTC_WALLET,
          tron: process.env.PLATFORM_TRON_WALLET,
        };

        const expectedWallet = platformWallets[chain];
        if (expectedWallet && to_address.toLowerCase() !== expectedWallet.toLowerCase()) {
          console.error('Payment to wrong wallet:', { to_address, expected: expectedWallet });
          return NextResponse.json({ error: 'Invalid destination' }, { status: 400 });
        }

        // TODO: Update booking payment status
        // await updatePaymentStatus(order_id, 'completed', {
        //   transaction_hash, chain, from_address, to_address, amount, token, confirmations
        // });

        break;
      }

      case 'payment.failed': {
        console.error('Crypto payment failed:', { transaction_hash, chain, order_id });
        // TODO: Update status to 'failed'
        break;
      }

      default:
        console.warn('Unknown crypto webhook event:', event_type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Crypto webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
