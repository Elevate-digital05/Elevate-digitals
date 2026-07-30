// Every data-i18n* key in the markup must exist in each ENABLED dictionary,
// or that language silently falls back to English mid-page.
// zu/xh are disabled in the UI (machine-translated, wrong in places), so gaps
// there are reported but don't fail — they're the backlog for whoever fixes them.
// Run: node check-i18n.mjs
import { readFileSync } from 'node:fs';

const ENABLED = ['en', 'af'];
const DISABLED = ['zu', 'xh'];

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');

const used = new Set(
  [...html.matchAll(/data-i18n(?:-html|-ph)?="([^"]+)"/g)].map(m => m[1])
);

const dicts = {};
for (const [, lang, body] of html.matchAll(/^\s{2}(en|af|zu|xh):\s*\{([\s\S]*?)^\s{2}\}/gm)) {
  // keys are packed several per line and values use both quote styles
  dicts[lang] = new Set([...body.matchAll(/([a-z0-9_]+)\s*:\s*["']/gi)].map(m => m[1]));
}

let bad = 0;
for (const lang of [...ENABLED, ...DISABLED]) {
  const enabled = ENABLED.includes(lang);
  const dict = dicts[lang];
  if (!dict) { console.error(`FAIL: no ${lang} dictionary found`); bad++; continue; }
  const missing = [...used].filter(k => !dict.has(k));
  if (!missing.length) console.log(`ok ${lang}: all ${used.size} keys present`);
  else if (enabled) { console.error(`FAIL ${lang}: missing ${missing.length} — ${missing.join(', ')}`); bad++; }
  else console.warn(`warn ${lang} (disabled): missing ${missing.length} — ${missing.join(', ')}`);
}
process.exit(bad ? 1 : 0);
