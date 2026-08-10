/* Tapping a mobile menu link must land on the new page at the top.
   Guards the regression where closeMenu restored the previous page's scroll
   offset and, because scroll-behavior is smooth, outran showPage's jump to
   top. Pulls the real source out of index.html so it cannot drift. */
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync('index.html', 'utf8');
const start = html.indexOf('let _menuScrollY');
const src = html.slice(start, html.indexOf('\n', html.indexOf('function navTo(id)')));
assert.ok(src.includes('function navTo'), 'menu source not found in index.html');

let scrolledTo = null, shown = null;
const body = { style: {} };
const menu = {
  classes: new Set(),
  classList: {
    contains: c => menu.classes.has(c),
    add: c => menu.classes.add(c),
    remove: c => menu.classes.delete(c),
  },
};
const sandbox = {
  document: { getElementById: () => menu, body },
  window: { scrollY: 0, scrollTo: (x, y) => { scrolledTo = y; } },
  showPage: id => { shown = id; },
};
const { toggleMenu, navTo } = new Function(
  ...Object.keys(sandbox), src + '\nreturn { toggleMenu, closeMenu, navTo };'
)(...Object.values(sandbox));

// Open the menu part-way down a long page.
sandbox.window.scrollY = 3200;
toggleMenu();
assert.equal(menu.classes.has('open'), true, 'menu should open');
assert.equal(body.style.position, 'fixed', 'body should lock while menu is open');
assert.equal(body.style.top, '-3200px', 'lock should preserve the offset');

// Tapping a nav link: no scroll restore, so the new page starts at the top.
scrolledTo = null;
navTo('packages');
assert.equal(shown, 'packages', 'navTo should switch page');
assert.equal(menu.classes.has('open'), false, 'menu should close on nav');
assert.equal(body.style.position, '', 'body should unlock on nav');
assert.equal(scrolledTo, null, 'nav must NOT restore the old scroll offset');

// Closing the menu without navigating still returns you where you were.
sandbox.window.scrollY = 3200;
toggleMenu();
scrolledTo = null;
toggleMenu();
assert.equal(scrolledTo, 3200, 'plain close should restore the offset');

console.log('ok menu scroll: nav starts at top, plain close restores position');
