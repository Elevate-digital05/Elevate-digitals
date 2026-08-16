# Elevate Digitals

Static site. No framework, no dependencies. `index.html` is the homepage and,
via `showPage()`, the services / packages / pay / blog / contact views too.
Alongside it are the generated service pages, three blog posts and three legal
pages. Deployed on Vercel, which serves the extensionless URLs (`cleanUrls`).

## Service pages are generated

`lib/services.js` is the single source of truth for every service line. From it,
`build.mjs` writes `services/*.html` and injects the derived bits back into
`index.html` and `sitemap.xml` between `<!--BUILD:…-->` markers — the homepage
service grid, the nav dropdown, the mobile menu group, the footer links and the
sitemap entries. Everything outside those markers is hand-written and safe to
edit.

`lib/packages.js` does the same for the four website packages: `build.mjs` bakes
each feature list into the package cards *and* the payment calculator, so both
surfaces come from one source and a crawler reads them in the HTML rather than
after a script runs. They were hand-written in two places once and drifted far
enough to sell an account manager who did not exist.

One thing is **not** generated: the four language dictionaries. A new service
needs an `i18n` key (`svc9`, …) plus `svcN_name` / `svcN_desc` in all four
dictionaries in `index.html`, or its homepage card stays English while the other
seven translate. `check-build.mjs` fails if the key is missing and
`check-i18n.mjs` fails if any dictionary is.

```
node build.mjs
```

Run it after any edit to `lib/services.js`, and **commit the generated files** —
Vercel serves them as-is and does not run this. The run prints every unset
`PRICE_TBC` so a placeholder cannot be published by accident.

To add or change a service, edit `lib/services.js` and re-run. Nothing else
needs touching: the page, the homepage card, the nav entry, the footer link, the
sitemap entry and the printable menu all come from that one object.

## The printable menu

`/menu` is generated from the same data. It is deliberately **not in the nav**
and carries `noindex` — it is a link you send directly and a PDF you attach to
email, not a landing page.

Printing: open `/menu`, hit **Save as PDF** (or Cmd-P), and choose "Save as
PDF". It is set up for A4 portrait with one service per page; the toolbar and
the contents list do not print. The current 8 services come to 9 pages at about
500KB, with Archivo embedded and the logo as vector — no raster anywhere, so it
stays sharp at any zoom and small enough to attach.

`check-build.mjs` fails if the menu ever grows a raster image, loses the A4 page
rule, drops a service's contact block, or gets linked from the nav.

## Running it locally

```
node dev-server.mjs
```

Serves the repo on http://localhost:4321, resolving URLs the way Vercel does —
it reads `cleanUrls`, `trailingSlash` and the redirects straight out of
`vercel.json` rather than restating them.

Use this rather than `python -m http.server`, which has no concept of clean
URLs: under it every extensionless link on the site (`/services/web-design`,
`/blog/whatsapp-marketing-website`, `/menu`) 404s locally while working fine in
production, so links can only be checked by reading their href instead of
clicking them.

## Checks

Run these before pushing. They exist because each one has already caught a live bug.

```
node check-i18n.mjs        # every data-i18n key exists in all four dictionaries
node check-prices.mjs      # index.html prices match what the server will accept
node check-menu-scroll.mjs # tapping a mobile menu link lands at the top of the new page
node check-packages.mjs    # package cards and the pay calculator render the same features
node check-build.mjs       # generated pages are current, and keep the promises we can keep
```

`check-build.mjs` also resolves every internal link against the real filesystem
using `vercel.json`'s rules, so a link that goes nowhere fails here rather than
in front of a visitor.

`check-build.mjs` is the one that guards the copy: every service page must carry
the POPIA legal links, the free-concept offer, a WhatsApp CTA and the real
support hours, must not invent social proof, and must not price anything at a
figure that is not published elsewhere on the site.

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
```

Premium Care has no plan on purpose: it is priced "from R3,500" and settled in
consultation, so a fixed monthly plan would bill the wrong amount. The pay page
shows it as a note, not a toggle. Set those subscriptions up by hand.

The four plan codes come from a one-time script. Put the secret key in
`.env.local` (gitignored) so it stays out of your shell history:

```
echo 'PAYSTACK_SECRET_KEY=sk_live_...' > .env.local
node setup-paystack-plans.mjs --list   # what already exists
node setup-paystack-plans.mjs          # create the four plans
```

It creates three monthly ZAR plans and prints the env lines. Running it twice
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
