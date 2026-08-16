/* The service pages, the homepage service grid, the footer links and the
   sitemap are generated from lib/services.js. Committing an edit to the data
   without re-running build.mjs would ship a site that disagrees with its own
   source — so this re-renders everything in memory and diffs it against what is
   on disk. It also holds the promises the brief made non-negotiable: legal
   links on every page, no invented social proof, and no support claim wider
   than the hours actually worked.
   Run: node check-build.mjs */
import { readFileSync, statSync } from 'node:fs';
import assert from 'node:assert/strict';
import { build } from './build.mjs';
import { SERVICES, HOURS } from './lib/services.js';

const { out, tbc } = build({ write: false });

/* ── generated output is current ── */
for (const [path, expected] of out) {
  let actual;
  try { actual = readFileSync(path, 'utf8'); }
  catch { assert.fail(`${path} has never been generated — run: node build.mjs`); }
  assert.equal(actual, expected, `${path} is stale — run: node build.mjs`);
}
console.log(`ok build: ${out.size} generated files match lib/services.js`);

/* ── every service page keeps the promises in the brief ── */
for (const svc of SERVICES) {
  const page = out.get(`services/${svc.slug}.html`);
  const at = m => `${svc.slug}: ${m}`;

  // POPIA: the legal links are not optional on any page.
  for (const legal of ['/privacy', '/terms', '/refund-policy']) {
    assert.ok(page.includes(`href="${legal}"`), at(`footer is missing the ${legal} link`));
  }

  // Head tags, mirroring the homepage pattern including the geo tags.
  for (const tag of ['<title>', 'name="description"', 'rel="canonical"', 'property="og:title"',
                     'property="og:description"', 'property="og:image"', 'name="geo.region"',
                     'name="geo.position"', 'name="twitter:card"']) {
    assert.ok(page.includes(tag), at(`head is missing ${tag}`));
  }
  assert.ok(page.includes(`<link rel="canonical" href="https://www.elevatedigitals.co.za/services/${svc.slug}">`),
    at('canonical points at the wrong URL'));
  assert.ok(JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]),
    at('structured data is not valid JSON'));

  // The sections the brief asked every page to carry.
  for (const [needle, what] of [["What's included", "what's included"], ["Who it's for", "who it's for"],
                                ['id="pricing"', 'pricing'], ['class="faq"', 'FAQs'],
                                ['homepage concept free', 'the free-concept offer'],
                                ['wa.me/27650858437', 'a WhatsApp CTA']]) {
    assert.ok(page.includes(needle), at(`page is missing ${what}`));
  }
  assert.ok(svc.faqs.length >= 3 && svc.faqs.length <= 5, at(`has ${svc.faqs.length} FAQs, brief asked for 3–5`));

  // Support hours. Nothing may promise cover wider than what is actually worked.
  // Saying "I do not offer 24/7 cover" is the honest version and must pass, so
  // each hit is only a failure when nothing negates it in the run-up.
  for (const m of page.matchAll(/24\/7|around the clock|any time of day|always available/gi)) {
    const runUp = page.slice(Math.max(0, m.index - 50), m.index);
    assert.match(runUp, /\b(not|no|never|don'?t|doesn'?t|without|rather than)\b/i,
      at(`promises "${m[0]}" support, which is wider than ${HOURS}`));
  }
  assert.ok(page.includes(HOURS), at('does not state the real support hours'));

  // No fabricated social proof. Placeholders are fine; invented clients are not.
  assert.doesNotMatch(page, /testimonial|our clients say|trusted by \d|case stud|\d+\+? happy (clients|customers)/i,
    at('contains social proof that was never supplied'));
}
console.log(`ok pages: ${SERVICES.length} service pages carry legal links, meta, the concept offer and honest hours`);

/* ── the hand-written standalone pages, held to the same bar ──
   These are not generated, so nothing else would notice if they fell behind.
   The blog posts did: they carried a text wordmark instead of the logo and had
   no legal links at all, which is a POPIA gap on a page that gets shared. */
for (const page of ['blog/website-cost-south-africa-2026.html', 'blog/whatsapp-marketing-website.html',
                    'blog/mobile-first-web-design-south-africa.html',
                    'privacy.html', 'terms.html', 'refund-policy.html']) {
  const html = readFileSync(page, 'utf8');
  const legal = ['/privacy', '/terms', '/refund-policy'].filter(l => html.includes(`href="${l}"`));
  // A legal page does not link to itself, so it carries the other two.
  const wanted = page.match(/^(privacy|terms|refund-policy)\.html$/) ? 2 : 3;
  assert.equal(legal.length, wanted, `${page}: expected ${wanted} legal links in the footer, found ${legal.length}`);
  assert.doesNotMatch(html, /class="logo">ELEVATE/,
    `${page}: still uses the text wordmark instead of /brand/logo-horizontal-ink.svg`);
}
console.log('ok standalone pages: blog and legal pages carry the real logo and the legal links');

/* ── the homepage actually links through to them ── */
const index = out.get('index.html');
for (const svc of SERVICES) {
  assert.ok(index.includes(`href="/services/${svc.slug}"`),
    `index.html does not link to /services/${svc.slug}`);
}
assert.ok(index.includes('routeFromHash'),
  'index.html lost the hash router, so every /#services link lands on the hero again');

/* ── card copy matches the English dictionary ──
   The homepage cards carry data-i18n keys, so applyTranslation('en') rewrites
   them from the dictionary on every language switch. If the generated text and
   the dictionary disagree, the card silently changes wording the first time
   someone toggles language and back. af/zu/xh are hand-translated from this
   English, so it is the English that has to stay put. */
const enDict = index.slice(index.indexOf('  en: {'), index.indexOf('  af: {'));
for (const svc of SERVICES) {
  // Without an i18n key the card renders English in all four languages, so the
  // grid half-translates. check-i18n.mjs then has nothing to complain about,
  // because the key is never used — this is the check that notices.
  assert.ok(svc.i18n, `${svc.slug}: no i18n key, so its homepage card would stay English in af/zu/xh`);
  for (const [field, value] of [['name', svc.name], ['desc', svc.cardDesc]]) {
    const m = enDict.match(new RegExp(`${svc.i18n}_${field}\\s*:\\s*'((?:[^'\\\\]|\\\\.)*)'`));
    assert.ok(m, `${svc.slug}: no ${svc.i18n}_${field} in the en dictionary`);
    assert.equal(m[1].replace(/\\'/g, "'"), value,
      `${svc.slug}: the en dictionary and lib/services.js disagree on ${svc.i18n}_${field}, so the card text changes when you switch language and back`);
  }
}
console.log('ok i18n: homepage card copy matches the English dictionary');

/* ── the printable menu ──
   It gets emailed as a PDF, so the things that break silently are: a raster
   logo (bloats the file and blurs when zoomed), a missing page rule, screen
   chrome that prints, and a service quietly dropping out of the document. */
const menu = out.get('menu.html');

assert.ok(menu.includes('name="robots" content="noindex, nofollow"'),
  'menu.html is indexable — it is a document to send, not a landing page');
assert.ok(!out.get('sitemap.xml').includes('/menu'), 'menu is in the sitemap but marked noindex');
// A link Kabelo sends directly, not a destination on the site.
assert.doesNotMatch(index, /href="\/menu"|navTo\('menu'\)|showPage\('menu'\)/,
  'index.html links to the menu — it is meant to stay out of the site navigation');

assert.match(menu, /@page\s*{\s*size:\s*A4 portrait/, 'menu.html has no A4 portrait page rule');
assert.ok(menu.includes('.m-svc { break-before:page;'), 'services no longer start on a fresh page');

// Live text and vector only. An <img>, a background-image or a data: URI here
// would mean the logo rasterises into the PDF, which the brief ruled out.
assert.ok(menu.includes('<svg class="logo"'), 'the logo is not inlined vector SVG');
assert.doesNotMatch(menu, /<img|background-image|url\(["']?data:image\/(png|jpe?g|gif|webp)/i,
  'menu.html contains a raster image — it must stay live text and vector');
assert.ok(menu.includes("family=Archivo"), 'menu.html is not loading the real Archivo webfont');

// Screen-only chrome must not reach paper.
const printCss = menu.slice(menu.indexOf('@media print'));
assert.match(printCss, /\.bar[^{]*{[^}]*display:none/, 'the toolbar prints');
for (const [sel, what] of [['.bar-btn', 'the Save as PDF button'], ['.m-index', 'the on-screen contents list']]) {
  assert.ok(menu.includes(sel), `menu.html lost ${what}`);
}
// index.html owns the currency and language toggles; the menu has neither, so
// there is nothing to hide rather than a rule that hides nothing.
assert.doesNotMatch(menu, /currency-selector|lang-selector|toggleCurrency|setLangAll/,
  'the menu grew a currency or language toggle — it is ZAR and English by design');

// Every service, and a contact block in every section.
for (const svc of SERVICES) {
  assert.ok(menu.includes(`id="${svc.slug}"`), `menu.html is missing ${svc.slug}`);
}
// A contact block inside every service section, so a page that gets separated
// from the rest still says how to reach him. Counting them site-wide would
// break every time the cover or the closing block changed.
for (const chunk of menu.split('<section class="m-svc"').slice(1)) {
  const slug = chunk.match(/id="([^"]+)"/)[1];
  assert.ok(chunk.slice(0, chunk.indexOf('</section>')).includes('class="m-contact"'),
    `menu section ${slug} has no contact block`);
}
for (const detail of ['wa.me/27650858437', 'info@elevatedigitals.co.za', '+27 65 085 8437', 'elevatedigitals.co.za']) {
  assert.ok(menu.includes(detail), `menu.html is missing ${detail}`);
}
console.log(`ok menu: ${SERVICES.length} sections, A4 print rules, inline vector logo, no raster`);

/* ── every internal link resolves to a file ──
   Checking that an href holds the right string is not the same as checking it
   goes anywhere. Resolution follows vercel.json's cleanUrls, which is also what
   dev-server.mjs implements, so a link that works locally works deployed. */
const { cleanUrls, redirects } = JSON.parse(readFileSync('vercel.json', 'utf8'));
const exists = p => { try { return statSync(p).isFile(); } catch { return false; } };
const resolves = href => {
  const path = href.split(/[?#]/)[0];
  if (path === '' || path === '/') return true;                 // homepage
  if (redirects.some(r => r.source === path)) return true;
  const rel = path.replace(/^\//, '');
  return exists(rel) || (cleanUrls && exists(rel + '.html')) || exists(rel + '/index.html');
};

const linkSources = [...out].map(([p, b]) => [p, b]).concat(
  ['blog/website-cost-south-africa-2026.html', 'blog/whatsapp-marketing-website.html',
   'blog/mobile-first-web-design-south-africa.html', 'privacy.html', 'terms.html', 'refund-policy.html']
    .map(p => [p, readFileSync(p, 'utf8')]));

let links = 0;
for (const [page, raw] of linkSources) {
  if (!page.endsWith('.html')) continue;
  // Commented-out markup is not a link. index.html parks a founder-photo
  // <img src="/kabelo.jpg"> in a TODO comment against a file that does not
  // exist yet, which is fine precisely because it never renders.
  const html = raw.replace(/<!--[\s\S]*?-->/g, '');
  for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    links++;
    assert.ok(resolves(href), `${page} links to ${href}, which resolves to no file — it will 404`);
  }
}
console.log(`ok links: ${links} internal links across ${linkSources.length} pages all resolve`);

/* ── package and retainer prices must match what the server will accept ──
   A service page quoting a package at a figure lib/pricing.js does not allow
   means Paystack takes the money and verify-payment rejects it — the exact
   failure check-prices.mjs was written for, one surface further out. Standalone
   service prices are Kabelo's to set and are only sanity-checked. */
const { PACKAGES_ZAR, RETAINERS_ZAR } = await import('./lib/pricing.js');
const server = { Starter: 8500, Business: 18500, Pro: 34999, Premium: 75000 };
for (const [name, zar] of Object.entries(server)) {
  assert.ok(PACKAGES_ZAR.includes(zar), `lib/pricing.js no longer allows R${zar} for ${name}`);
}

for (const svc of SERVICES) {
  for (const t of svc.pricing.tiers) {
    if (t.price?.tbc) continue;
    assert.ok(Number.isInteger(t.price) && t.price > 0,
      `${svc.slug}: "${t.name}" has a price that is not a whole number of rands`);

    if (server[t.name]) {
      assert.equal(t.price, server[t.name],
        `${svc.slug}: "${t.name}" is priced R${t.price} but the payment API only accepts R${server[t.name]}`);
    }
    if (t.name.endsWith('Care')) {
      assert.ok(RETAINERS_ZAR.includes(t.price),
        `${svc.slug}: retainer "${t.name}" is R${t.price}, which lib/pricing.js does not list`);
    }
  }
}
console.log(tbc.length
  ? `ok prices: packages and retainers match lib/pricing.js; ${tbc.length} still marked PRICE_TBC`
  : 'ok prices: packages and retainers match lib/pricing.js, no placeholders left');
