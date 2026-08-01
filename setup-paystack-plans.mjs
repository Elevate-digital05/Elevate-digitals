// One-time setup: creates the four monthly retainer plans on your Paystack
// account and prints the env vars to paste into Vercel.
//
// Run it once, against live:
//   PAYSTACK_SECRET_KEY=sk_live_... node setup-paystack-plans.mjs
//
// Running it twice creates duplicate plans — Paystack does not dedupe by name.
// Pass --list first to see what already exists.
import { RETAINER_PLANS } from './lib/pricing.js';
import { createPlan } from './lib/paystack.js';

const key = process.env.PAYSTACK_SECRET_KEY;
if (!key) {
  console.error('PAYSTACK_SECRET_KEY is not set.\n' +
    'Run: PAYSTACK_SECRET_KEY=sk_live_... node setup-paystack-plans.mjs');
  process.exit(1);
}
console.log(`Using ${key.startsWith('sk_live') ? 'LIVE' : 'TEST'} key\n`);

if (process.argv.includes('--list')) {
  const res = await fetch('https://api.paystack.co/plan?perPage=100', {
    headers: { Authorization: `Bearer ${key}` }
  });
  const body = await res.json();
  const plans = (body.data || []);
  if (!plans.length) console.log('No plans on this account yet.');
  for (const p of plans) {
    console.log(`${p.plan_code}  ${p.name}  ${p.currency} ${p.amount / 100}/${p.interval}`);
  }
  process.exit(0);
}

const lines = [];
for (const [name, { zar, env }] of Object.entries(RETAINER_PLANS)) {
  const { ok, payload } = await createPlan({ name: `${name} (monthly retainer)`, amountZAR: zar });
  if (!ok || !payload || !payload.status) {
    console.error(`FAILED ${name}: ${payload && payload.message}`);
    process.exit(1);
  }
  console.log(`created ${name.padEnd(14)} R${zar}/mo  ${payload.data.plan_code}`);
  lines.push(`${env}=${payload.data.plan_code}`);
}

console.log('\nAdd these to Vercel → Settings → Environment Variables:\n');
console.log(lines.join('\n'));
