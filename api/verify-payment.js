// Verifies a Paystack transaction server-side using the secret key.
// Requires PAYSTACK_SECRET_KEY (sk_live_... or sk_test_...) in Vercel env vars.

import { VALID_DEPOSIT_AMOUNTS_ZAR } from '../lib/pricing.js';
import { getTransaction } from '../lib/paystack.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ status: false, message: 'Method not allowed' });
  }

  const { reference } = req.body || {};
  if (typeof reference !== 'string' || !reference || reference.length > 100) {
    return res.status(400).json({ status: false, message: 'Invalid reference' });
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return res.status(500).json({ status: false, message: 'Server not configured' });
  }

  try {
    const { payload } = await getTransaction(reference);
    const tx = payload && payload.data;

    if (!payload || !payload.status || !tx || tx.status !== 'success') {
      return res.status(402).json({
        status: false,
        message: 'Payment not successful',
        detail: tx && tx.status
      });
    }
    if (tx.currency !== 'ZAR') {
      return res.status(402).json({ status: false, message: 'Unexpected currency' });
    }
    const amountZAR = tx.amount / 100;
    if (!VALID_DEPOSIT_AMOUNTS_ZAR.has(amountZAR)) {
      return res.status(402).json({ status: false, message: 'Amount mismatch' });
    }

    return res.status(200).json({
      status: true,
      reference: tx.reference,
      amount_zar: amountZAR,
      paid_at: tx.paid_at,
      email: tx.customer && tx.customer.email,
      // tells the browser whether offering the retainer is worth it
      can_subscribe: Boolean(tx.authorization && tx.authorization.reusable)
    });
  } catch (err) {
    return res.status(502).json({ status: false, message: 'Verification upstream error' });
  }
}
