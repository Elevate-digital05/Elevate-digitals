// Verifies a Paystack transaction server-side using the secret key.
// Requires PAYSTACK_SECRET_KEY (sk_live_... or sk_test_...) in Vercel env vars.

const VALID_DEPOSIT_AMOUNTS_ZAR = new Set([
  // base packages (50% deposit)
  3500, 7500, 15000, 30000,
  // + Basic Care (R499/mo)
  3749, 7749, 15249, 30249,
  // + Full Care (R999/mo)
  3999, 7999, 15499, 30499,
  // + Growth Care (R1,999/mo)
  4499, 8499, 15999, 30999
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ status: false, message: 'Method not allowed' });
  }

  const { reference } = req.body || {};
  if (typeof reference !== 'string' || !reference || reference.length > 100) {
    return res.status(400).json({ status: false, message: 'Invalid reference' });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ status: false, message: 'Server not configured' });
  }

  try {
    const r = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secret}` } }
    );
    const payload = await r.json();
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
      email: tx.customer && tx.customer.email
    });
  } catch (err) {
    return res.status(502).json({ status: false, message: 'Verification upstream error' });
  }
}
