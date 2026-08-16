/* The package cards and the payment calculator used to keep separate
   hand-written copies of every feature list, and they drifted — the calculator
   sold Pro clients a "Dedicated Account Manager" that nobody was employed to
   be. They then spent a while being rendered from one source by JavaScript on
   load, which fixed the drift but shipped four empty <ul>s to the crawler on
   the one page that has to rank.

   Both surfaces are now baked into index.html by build.mjs from
   lib/packages.js. This checks the baked HTML against that data, so neither
   the drift nor the empty-lists regression can come back quietly.
   Run: node check-packages.mjs */
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { PACKAGES } from './lib/packages.js';

const html = readFileSync('index.html', 'utf8');
// The New badge is a sibling span inside the <li>, so it has to come out
// before tags are stripped or it concatenates onto the label it decorates.
const strip = s => s
  .replace(/<span class="p-feat-new">.*?<\/span>/gs, '')
  .replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim();

const between = (key) => {
  const open = `<!--BUILD:${key}-->`, close = `<!--/BUILD:${key}-->`;
  const i = html.indexOf(open), j = html.indexOf(close);
  assert.ok(i > 0 && j > i, `index.html has no ${open} … ${close} block — run: node build.mjs`);
  return html.slice(i + open.length, j);
};

for (const [name, pkg] of Object.entries(PACKAGES)) {
  const labels = pkg.features.map(f => Array.isArray(f) ? f[0] : f);

  /* ── the package card ── */
  const card = between(`feats-${name}`);
  const cardItems = [...card.matchAll(/<li>(.*?)<\/li>/gs)].map(m => strip(m[1]));
  assert.deepEqual(cardItems, labels.map(l => strip(l)),
    `${name}: the package card's features do not match lib/packages.js`);

  /* ── the payment calculator ── */
  const pay = between(`pay-${name}`);
  const chips = [...pay.matchAll(/<span>(.*?)<\/span>/gs)].map(m => strip(m[1]));
  assert.deepEqual(chips, labels.map(l => strip(l)),
    `${name}: the calculator's features do not match the package card`);
  assert.equal(strip(pay.match(/<div class="pay-plan-desc">(.*?)<\/div>/s)[1]), strip(pkg.summary),
    `${name}: the calculator summary does not match lib/packages.js`);

  /* ── in the source, not conjured by script ── */
  assert.ok(cardItems.length > 0, `${name}: the package card is empty in the HTML source`);
}

/* ── the New badge lands on the card and stays out of the chips ── */
assert.match(between('feats-Starter'), /<span class="p-feat-new">New<\/span>/,
  'the New badge stopped rendering on package cards');
assert.doesNotMatch(between('pay-Starter'), /p-feat-new/,
  'the New badge leaked into the calculator chips, which have no room for it');

/* ── nothing may promise staff standing between a client and the work ── */
const promises = Object.values(PACKAGES).flatMap(p => [p.summary, ...p.features.flat()]);
for (const line of promises) {
  assert.doesNotMatch(line, /account manager/i,
    `PACKAGES promises an account manager: "${line}" — clients reach the people doing the work`);
}
const jsonLd = html.slice(html.indexOf('<script type="application/ld+json">'),
                          html.indexOf('</script>', html.indexOf('<script type="application/ld+json">')));
assert.doesNotMatch(jsonLd, /account manager/i,
  'the JSON-LD offers still promise an account manager');
assert.ok(PACKAGES.Pro.features.includes('Direct access to the people doing the work'),
  'Pro lost the direct-access wording');

/* ── the renderer is gone; nothing should be filling these in at runtime ── */
assert.doesNotMatch(html, /renderPackageFeatures|const PACKAGES\s*=/,
  'index.html renders package features at runtime again — they belong in the HTML source');

/* ── every plan the markup names has data behind it ── */
for (const [, name] of html.matchAll(/class="(?:p-card|pay-plan-item)[^"]*"[^>]*data-plan="([^"]+)"/g)) {
  assert.ok(PACKAGES[name], `markup names plan "${name}" but lib/packages.js has no entry for it`);
}

const total = Object.values(PACKAGES).reduce((n, p) => n + p.features.length, 0);
console.log(`ok packages: ${total} features baked into both surfaces from lib/packages.js`);
