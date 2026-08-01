// Starts a monthly retainer as a real Paystack subscription, using the card
// authorisation from the deposit the client just paid. No second card entry.
//
// The browser only names a plan ("Starter Care"); the price and the plan code
// are resolved here, so a tampered request cannot subscribe anyone to a
// cheaper plan than the one they agreed to.
//
// Requires in Vercel env vars:
//   PAYSTACK_SECRET_KEY
//   PAYSTACK_PLAN_STARTER_CARE, _BUSINESS_CARE, _PRO_CARE, _PREMIUM_CARE
// Create the plans and print those lines with: node setup-paystack-plans.mjs

import {
  VALID_DEPOSIT_AMOUNTS_ZAR,
  RETAINER_PLANS,
  RETAINER_START_DELAY_DAYS
} from '../lib/pricing.js';
import { getTransaction, createSubscription } from '../lib/paystack.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ status: false, message: 'Method not allowed' });
  }

  const { reference, plan } = req.body || {};
  if (typeof reference !== 'string' || !reference || reference.length > 100) {
    return res.status(400).json({ status: false, message: 'Invalid reference' });
  }
  const chosen = RETAINER_PLANS[plan];
  if (!chosen) {
    return res.status(400).json({ status: false, message: 'Unknown plan' });
  }

  const planCode = process.env[chosen.env];
  if (!process.env.PAYSTACK_SECRET_KEY || !planCode) {
    return res.status(500).json({ status: false, message: 'Retainer plans are not configured' });
  }

  try {
    // The deposit must be real before anything recurring is set up against it.
    const { payload } = await getTransaction(reference);
    const tx = payload && payload.data;
    if (!payload || !payload.status || !tx || tx.status !== 'success') {
      return res.status(402).json({ status: false, message: 'Deposit not verified' });
    }
    if (tx.currency !== 'ZAR' || !VALID_DEPOSIT_AMOUNTS_ZAR.has(tx.amount / 100)) {
      return res.status(402).json({ status: false, message: 'Deposit does not match a known package' });
    }

    const auth = tx.authorization;
    const customerCode = tx.customer && tx.customer.customer_code;
    if (!customerCode) {
      return res.status(402).json({ status: false, message: 'No customer on that transaction' });
    }
    // Instant EFT and some cards cannot be charged again. Say so plainly
    // rather than creating a subscription that will fail on its first debit.
    if (!auth || !auth.authorization_code || auth.reusable === false) {
      return res.status(409).json({
        status: false,
        message: 'That payment method cannot be charged again automatically',
        code: 'not_reusable'
      });
    }

    const startDate = new Date(Date.now() + RETAINER_START_DELAY_DAYS * 86400000).toISOString();
    const sub = await createSubscription({
      customer: customerCode,
      plan: planCode,
      authorization: auth.authorization_code,
      startDate
    });

    if (!sub.ok || !sub.payload || !sub.payload.status) {
      return res.status(502).json({
        status: false,
        message: 'Paystack rejected the subscription',
        detail: sub.payload && sub.payload.message
      });
    }

    const data = sub.payload.data || {};
    return res.status(200).json({
      status: true,
      plan,
      amount_zar: chosen.zar,
      subscription_code: data.subscription_code,
      first_debit: data.next_payment_date || startDate
    });
  } catch (err) {
    return res.status(502).json({ status: false, message: 'Subscription upstream error' });
  }
}
