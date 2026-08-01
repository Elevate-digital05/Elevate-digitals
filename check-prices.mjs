// The deposit allowlist in lib/pricing.js is a hardcoded copy of the
// prices in index.html. When they drift, Paystack takes the money and the
// verification call rejects it — which is exactly what happened between the
// 2025 prices and the current ones. This fails loudly instead.
// Run: node check-prices.mjs
import { readFileSync } from 'node:fs';
import { PACKAGES_ZAR, RETAINERS_ZAR, VALID_DEPOSIT_AMOUNTS_ZAR, RETAINER_PLANS, NON_SUBSCRIBABLE_RETAINERS_ZAR } from './lib/pricing.js';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');

const pull = (re) => [...html.matchAll(re)].map(m => parseInt(m[1], 10));
const packages = [...new Set(pull(/class="pay-plan-item[^"]*"[^>]*data-price="(\d+)"/g))];
const retainers = [...new Set(pull(/class="pay-addon-toggle[^"]*"[^>]*data-price="(\d+)"/g))];
const subscribable = RETAINERS_ZAR.filter(r => !NON_SUBSCRIBABLE_RETAINERS_ZAR.includes(r));

let bad = 0;
const compare = (name, found, expected) => {
  const a = [...found].sort((x, y) => x - y).join(',');
  const b = [...expected].sort((x, y) => x - y).join(',');
  if (!found.length) { console.error(`FAIL ${name}: none found in index.html — did the markup change?`); bad++; }
  else if (a !== b) { console.error(`FAIL ${name}: index.html has [${a}], lib/pricing.js has [${b}]`); bad++; }
  else console.log(`ok ${name}: [${a}]`);
};

compare('packages', packages, PACKAGES_ZAR);
// only the fixed-price retainers are toggles on the pay page
compare('subscribable retainers', retainers, subscribable);
compare('retainer plans', subscribable, Object.values(RETAINER_PLANS).map(p => p.zar));
for (const zar of NON_SUBSCRIBABLE_RETAINERS_ZAR) {
  if (Object.values(RETAINER_PLANS).some(p => p.zar === zar)) {
    console.error(`FAIL: R${zar} is negotiated but has a fixed subscription plan`); bad++;
  } else console.log(`ok R${zar} retainer is not auto-billed`);
}

// The deposit is 50% of the package alone. A retainer must never change it —
// that was the bug that billed half a month once and never recurred.
if (!VALID_DEPOSIT_AMOUNTS_ZAR.has(4250)) { console.error('FAIL Starter deposit R4250 would be rejected'); bad++; }
else console.log('ok Starter deposit: R4250 accepted');
if (VALID_DEPOSIT_AMOUNTS_ZAR.has(Math.round((8500 + 799) / 2))) {
  console.error('FAIL: a deposit with a retainer folded in is still accepted'); bad++;
} else console.log('ok retainer is not folded into the deposit');

console.log(`${VALID_DEPOSIT_AMOUNTS_ZAR.size} deposit amounts allowed`);
process.exit(bad ? 1 : 0);
