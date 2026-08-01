// The deposit allowlist in api/verify-payment.js is a hardcoded copy of the
// prices in index.html. When they drift, Paystack takes the money and the
// verification call rejects it — which is exactly what happened between the
// 2025 prices and the current ones. This fails loudly instead.
// Run: node check-prices.mjs
import { readFileSync } from 'node:fs';
import { PACKAGES_ZAR, RETAINERS_ZAR, VALID_DEPOSIT_AMOUNTS_ZAR } from './api/verify-payment.js';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');

const pull = (re) => [...html.matchAll(re)].map(m => parseInt(m[1], 10));
const packages = [...new Set(pull(/class="pay-plan-item[^"]*"[^>]*data-price="(\d+)"/g))];
const retainers = [...new Set(pull(/class="pay-addon-toggle[^"]*"[^>]*data-price="(\d+)"/g))];

let bad = 0;
const compare = (name, found, expected) => {
  const a = [...found].sort((x, y) => x - y).join(',');
  const b = [...expected].sort((x, y) => x - y).join(',');
  if (!found.length) { console.error(`FAIL ${name}: none found in index.html — did the markup change?`); bad++; }
  else if (a !== b) { console.error(`FAIL ${name}: index.html has [${a}], verify-payment.js has [${b}]`); bad++; }
  else console.log(`ok ${name}: [${a}]`);
};

compare('packages', packages, PACKAGES_ZAR);
compare('retainers', retainers, RETAINERS_ZAR.filter(r => r > 0));

// spot-check the arithmetic the page does: 50% of package + retainer
const starter = Math.round(8500 / 2);
const starterPlusCare = Math.round((8500 + 799) / 2);
for (const [label, amount] of [['Starter deposit', starter], ['Starter + Starter Care', starterPlusCare]]) {
  if (!VALID_DEPOSIT_AMOUNTS_ZAR.has(amount)) { console.error(`FAIL ${label}: R${amount} would be rejected`); bad++; }
  else console.log(`ok ${label}: R${amount} accepted`);
}

console.log(`${VALID_DEPOSIT_AMOUNTS_ZAR.size} deposit amounts allowed`);
process.exit(bad ? 1 : 0);
