/* The package cards and the payment calculator used to keep separate
   hand-written copies of every feature list, and they drifted — the calculator
   sold Pro clients a "Dedicated Account Manager" that a one-person studio
   cannot staff. Both now render from PACKAGES. This runs the real renderer
   from index.html against a stub DOM so a regression fails here, not in front
   of a client reading two different promises on two pages.
   Run: node check-packages.mjs */
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync('index.html', 'utf8');

/* ── pull the real source out of index.html so it cannot drift ── */
const start = html.indexOf('const PACKAGES = {');
const end = html.indexOf('   PAYMENT CALCULATOR');
assert.ok(start > 0 && end > start, 'PACKAGES block not found in index.html');
const src = html.slice(start, html.lastIndexOf('/*', end));

/* ── stub DOM: every selector hands back a node that remembers what was set ── */
const nodes = {};
const node = () => ({
  innerHTML: '', textContent: '', kids: {},
  querySelector(sel) { return this.kids[sel] ??= node(); },
});
const document = { querySelector: sel => nodes[sel] ??= node() };

const { PACKAGES } = new Function('document', src + '\nreturn { PACKAGES };')(document);

const card = name => nodes[`.p-card[data-plan="${name}"] .p-feats`];
const pay = name => nodes[`.pay-plan-item[data-plan="${name}"]`];

/* ── both surfaces render, and render the same features ── */
for (const [name, pkg] of Object.entries(PACKAGES)) {
  const labels = pkg.features.map(f => Array.isArray(f) ? f[0] : f);

  assert.equal(card(name).innerHTML.match(/<li>/g).length, labels.length,
    `${name}: package card rendered the wrong number of features`);
  assert.equal(pay(name).kids['.pay-plan-features'].innerHTML.match(/<span>/g).length, labels.length,
    `${name}: calculator rendered the wrong number of features`);

  for (const label of labels) {
    assert.ok(card(name).innerHTML.includes(label), `${name}: card is missing "${label}"`);
    assert.ok(pay(name).kids['.pay-plan-features'].innerHTML.includes(label),
      `${name}: calculator is missing "${label}"`);
  }
  assert.equal(pay(name).kids['.pay-plan-desc'].textContent, pkg.summary,
    `${name}: calculator summary did not render`);
}

/* ── the "New" badge survives the round trip ── */
assert.ok(card('Starter').innerHTML.includes('<span class="p-feat-new">New</span>'),
  'the New badge stopped rendering on package cards');
assert.ok(!pay('Starter').kids['.pay-plan-features'].innerHTML.includes('p-feat-new'),
  'the New badge leaked into the calculator chips, which have no room for it');

/* ── one-person studio: nothing may promise staff ──
   The founder bio's "rather than an account manager" is the opposite claim and
   is allowed, so this checks the places that make promises: the feature data
   and the structured data Google reads. Both had their own copy; the JSON-LD
   one outlived the visible fix by a commit. */
const promises = Object.values(PACKAGES).flatMap(p => [p.summary, ...p.features.flat()]);
for (const line of promises) {
  assert.doesNotMatch(line, /account manager/i,
    `PACKAGES promises an account manager: "${line}" — this is a one-person studio`);
}
const jsonLd = html.slice(html.indexOf('<script type="application/ld+json">'),
                          html.indexOf('</script>', html.indexOf('<script type="application/ld+json">')));
assert.doesNotMatch(jsonLd, /account manager/i,
  'the JSON-LD offers still promise an account manager');
assert.ok(PACKAGES.Pro.features.includes('Direct access to the person building it'),
  'Pro lost the direct-access wording');

/* ── no hand-written copy has crept back into the markup ── */
assert.equal((html.match(/<ul class="p-feats"><\/ul>/g) || []).length, 4,
  'a package card has a hand-written feature list again instead of rendering from PACKAGES');
assert.equal((html.match(/<div class="pay-plan-desc"><\/div><div class="pay-plan-features"><\/div>/g) || []).length, 4,
  'a calculator plan has hand-written features again instead of rendering from PACKAGES');

/* ── every plan the markup names has data behind it ── */
for (const [, name] of html.matchAll(/class="(?:p-card|pay-plan-item)[^"]*"[^>]*data-plan="([^"]+)"/g)) {
  assert.ok(PACKAGES[name], `markup names plan "${name}" but PACKAGES has no entry for it`);
}

console.log(`ok packages: ${Object.keys(PACKAGES).length} plans render to both surfaces from one source`);
