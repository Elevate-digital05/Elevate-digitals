# Elevate Digitals

Static site. No build step, no framework, no dependencies — `index.html` is the
whole thing, plus three blog posts and three legal pages. Deployed on Vercel.

## Checks

Run these before pushing. They exist because each one has already caught a live bug.

```
node check-i18n.mjs     # every data-i18n key exists in all four dictionaries
node check-prices.mjs   # index.html prices match what the server will accept
```

## Payments

Paystack. Card entry happens in Paystack's own popup; no card data touches this site.

- `api/verify-payment.js` — confirms a deposit server-side before we act on it
- `api/start-retainer.js` — turns a monthly retainer into a Paystack subscription,
  charged against the card authorisation left behind by the deposit
- `lib/pricing.js` — prices, valid deposit amounts, retainer plan lookup

The deposit is 50% of the package **only**. Retainers are subscriptions and must
never be folded into it.

### Environment variables (Vercel → Settings → Environment Variables)

```
PAYSTACK_SECRET_KEY           sk_live_...
PAYSTACK_PLAN_STARTER_CARE    PLN_...
PAYSTACK_PLAN_BUSINESS_CARE   PLN_...
PAYSTACK_PLAN_PRO_CARE        PLN_...
PAYSTACK_PLAN_PREMIUM_CARE    PLN_...
```

The four plan codes come from a one-time script. Put the secret key in
`.env.local` (gitignored) so it stays out of your shell history:

```
echo 'PAYSTACK_SECRET_KEY=sk_live_...' > .env.local
node setup-paystack-plans.mjs --list   # what already exists
node setup-paystack-plans.mjs          # create the four plans
```

It creates four monthly ZAR plans and prints the env lines. Running it twice
creates duplicates — Paystack does not dedupe by name, so check `--list` first.

Until those four variables are set, `start-retainer` returns "Retainer plans are
not configured" and the deposit still works: the client is told the retainer was
not started and to message on WhatsApp.

## Brand

`theme.css` holds every colour as a custom property. Nothing else in the repo
should carry a literal colour value. `/brand` holds the logo files, favicons and
og-image; `brand/README.md` is the source of truth for usage.

## Tools

`tools/invoice.html` — fillable, printable invoice. Not linked from the site.
