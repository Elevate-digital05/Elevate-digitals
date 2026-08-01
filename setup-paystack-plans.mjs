// One-time setup: creates the fixed-price monthly retainer plans on your Paystack
// account and prints the env vars to paste into Vercel.
//
// Put your secret key in .env.local (gitignored) so it never lands in your
// shell history or a screen share:
//   echo 'PAYSTACK_SECRET_KEY=sk_live_...' > .env.local
//   node setup-paystack-plans.mjs --list   # what already exists
//   node setup-paystack-plans.mjs          # create the plans
//
// Running it twice creates duplicate plans — Paystack does not dedupe by name.
import { RETAINER_PLANS } from './lib/pricing.js';
import { createPlan } from './lib/paystack.js';

try { process.loadEnvFile('.env.local'); } catch { /* fall back to the environment */ }

const key = process.env.PAYSTACK_SECRET_KEY;
if (!key) {
  console.error('PAYSTACK_SECRET_KEY is not set.\n' +
    "Put it in .env.local:  echo 'PAYSTACK_SECRET_KEY=sk_live_...' > .env.local");
  process.exit(1);
}
console.log(`Using ${key.startsWith('sk_live') ? 'LIVE' : 'TEST'} key\n`);

if (process.argv.includes('--list')) {
  const res = await fetch('https://api.paystack.co/plan?perPage=100', {
    headers: { Authorization: `Bearer ${key}` }
  });
  const body = await res.json();
  if (!res.ok || !body.status) {
    console.error(`Paystack rejected the request: ${body.message || res.status}`);
    process.exit(1);
  }
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
