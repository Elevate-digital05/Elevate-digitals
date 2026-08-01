// Single source of truth for what the server will accept, shared by the API
// routes and by check-prices.mjs, which fails if these drift from the
// data-price attributes in index.html.

export const PACKAGES_ZAR = [8500, 18500, 34999, 75000];

// Retainers are monthly subscriptions, not part of the deposit. The deposit is
// 50% of the package alone — an earlier version folded a month's retainer into
// the once-off total and charged half of it, which billed the client for half a
// month, once, and never again.
export const RETAINERS_ZAR = [799, 1299, 1999, 3500];

export const VALID_DEPOSIT_AMOUNTS_ZAR = new Set(
  PACKAGES_ZAR.map(pkg => Math.round(pkg / 2))
);

// Plan codes are created once against the live Paystack account by
// setup-paystack-plans.mjs, then set as Vercel env vars. They are looked up
// server-side so the browser can only ever name a plan, never choose a price.
export const RETAINER_PLANS = {
  'Starter Care':  { zar: 799,  env: 'PAYSTACK_PLAN_STARTER_CARE'  },
  'Business Care': { zar: 1299, env: 'PAYSTACK_PLAN_BUSINESS_CARE' },
  'Pro Care':      { zar: 1999, env: 'PAYSTACK_PLAN_PRO_CARE'      },
  'Premium Care':  { zar: 3500, env: 'PAYSTACK_PLAN_PREMIUM_CARE'  }
};

// Retainers cover hosting and upkeep of a live site, so the first debit is
// dated past the build rather than taken on the day the deposit clears.
export const RETAINER_START_DELAY_DAYS = 30;
