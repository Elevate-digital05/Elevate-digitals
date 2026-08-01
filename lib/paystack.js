// Thin wrapper over the Paystack REST API. Both API routes go through this so
// the secret key is read in exactly one place.

const BASE = 'https://api.paystack.co';

export function secret() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error('PAYSTACK_SECRET_KEY is not set');
  return key;
}

async function call(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      Authorization: `Bearer ${secret()}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const payload = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, payload };
}

export function getTransaction(reference) {
  return call('GET', `/transaction/verify/${encodeURIComponent(reference)}`);
}

// Requires an existing authorization on the customer — Paystack charges
// subscriptions against a card already authorised by a previous transaction.
// start_date is ISO 8601 and sets the first debit.
export function createSubscription({ customer, plan, authorization, startDate }) {
  return call('POST', '/subscription', {
    customer,
    plan,
    authorization,
    start_date: startDate
  });
}

export function createPlan({ name, amountZAR, interval = 'monthly' }) {
  return call('POST', '/plan', {
    name,
    interval,
    amount: amountZAR * 100, // smallest currency unit
    currency: 'ZAR'
  });
}
