// Renders every service page from lib/services.js, then injects the derived
// bits back into index.html and sitemap.xml between BUILD markers.
//
// Adding or changing a service is a change to lib/services.js and a re-run of
// this. Nothing is hand-maintained in two places, which is the whole reason
// this file exists: the package feature lists used to be, and they drifted far
// enough to promise clients an account manager that does not exist.
//
// Run: node build.mjs        (then commit the generated files)
// Check: node check-build.mjs (fails if the committed output is stale)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { SERVICES, HOURS } from './lib/services.js';

const SITE = 'https://www.elevatedigitals.co.za';
const WA = '27650858437';
const EMAIL = 'info@elevatedigitals.co.za';
const PHONE = '+27 65 085 8437';

/* ── icons ──────────────────────────────────────────────────────────────
   Lucide-style, 24x24, 1.75 stroke — the same set already inlined in
   index.html, kept here once instead of per page. */
const STROKE = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  link: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  pencil: '<path d="M13 21h8"/><path d="m15 5 4 4"/><path d="M18.4 2.6a2.17 2.17 0 0 1 3 3L6 21l-4 1 1-4Z"/>',
  smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  map: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  card: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.41 5.956-2.738 7.326"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  server: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  trending: '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  type: '<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>',
  check: '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
  video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  palette: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
  layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m6.08 11-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83L17.9 11"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
};
const WA_PATH = '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>';

const icon = (name, size = 20) => {
  const d = ICONS[name];
  if (!d) throw new Error(`unknown icon "${name}" — add it to ICONS in build.mjs`);
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${STROKE} aria-hidden="true">${d}</svg>`;
};
const waIcon = (size = 18) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${WA_PATH}</svg>`;

/* ── helpers ── */
const esc = s => String(s).replace(/&(?![a-zA-Z#0-9]+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const stripTags = s => String(s).replace(/<[^>]+>/g, '');
// Grouped by hand, not toLocaleString: Node's en-ZA locale separates thousands
// with a non-breaking space ("R8 500"), and every other price on this site is
// written "R8,500". A mismatch there reads as two different price lists.
const zar = n => 'R' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

// Every unset price, collected while rendering so the run can list them. A Set,
// because each figure renders on both its service page and the menu and one
// number to fill in should be reported once, not twice.
const tbc = new Set();
function price(p, { service, tier }) {
  if (p && p.tbc) {
    tbc.add(`${service} → ${tier}`);
    return '<span class="tbc">PRICE_TBC</span>';
  }
  return zar(p);
}

/* ── page template ── */
function renderPage(svc, all) {
  const url = `${SITE}/services/${svc.slug}`;
  const [before, hl, after] = svc.hero.h1;
  const h1Text = `${before}${hl}${after}`;
  const others = all.filter(s => s.slug !== svc.slug);

  const included = svc.included.map(i => `
        <div class="incl">
          <div class="incl-ico">${i.icon === 'whatsapp' ? waIcon(19) : icon(i.icon, 19)}</div>
          <h3>${esc(i.name)}</h3>
          <p>${esc(i.desc)}</p>
        </div>`).join('');

  const who = svc.who.map(([lead, rest]) =>
    `        <li><span><strong>${esc(lead)}</strong> ${esc(rest)}</span></li>`).join('\n');

  const tiers = svc.pricing.tiers.map(t => `
        <div class="tier${t.rec ? ' rec' : ''}">
          ${t.rec ? '<span class="tier-tag">Recommended</span>' : ''}
          <div class="tier-name">${esc(t.name)}</div>
          <div class="tier-price">${price(t.price, { service: svc.name, tier: t.name })}${t.plus ? '+' : ''}${t.per ? `<span class="tier-period"> /${t.per}</span>` : ''}</div>
          <div class="tier-period">${esc(t.period)}</div>
          <p class="tier-desc">${esc(t.desc)}</p>
          <ul class="tier-feats">${t.feats.map(f => `<li><span>${esc(f)}</span></li>`).join('')}</ul>
          <a class="btn ${t.rec ? 'btn-primary' : 'btn-ghost'}" href="${attr(waLink(`Hi Kabelo, I'm interested in ${svc.name} (${t.name}).`))}" target="_blank" rel="noopener noreferrer">Enquire</a>
        </div>`).join('');

  const faqs = svc.faqs.map(f => `
        <details class="faq">
          <summary>${esc(f.q)}</summary>
          <p>${f.a}</p>
        </details>`).join('');

  const otherLinks = others.map(s =>
    `        <a href="/services/${s.slug}">${esc(s.name)} <span aria-hidden="true">→</span></a>`).join('\n');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: svc.name,
        description: svc.metaDescription,
        serviceType: svc.name,
        url,
        provider: { '@type': 'LocalBusiness', '@id': `${SITE}/#business`, name: 'Elevate Digitals' },
        areaServed: [
          { '@type': 'State', name: 'Western Cape' },
          { '@type': 'State', name: 'Gauteng' },
          { '@type': 'Country', name: 'South Africa' },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE}/#services` },
          { '@type': 'ListItem', position: 3, name: svc.name, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: svc.faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) },
        })),
      },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
<title>${esc(svc.metaTitle)} | Elevate Digitals</title>
<meta name="description" content="${attr(svc.metaDescription)}">
<meta name="keywords" content="${attr(svc.keywords)}">
<meta name="author" content="Elevate Digitals">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="geo.region" content="ZA">
<meta name="geo.country" content="South Africa">
<meta name="geo.placename" content="Cape Town, Western Cape, South Africa">
<meta name="geo.position" content="-33.9249;18.4241">
<meta name="ICBM" content="-33.9249, 18.4241">
<meta name="theme-color" content="#EDEDEA">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="alternate icon" type="image/png" href="/brand/favicon-180.png">
<link rel="apple-touch-icon" href="/brand/favicon-180.png">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_ZA">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${attr(svc.metaTitle)}">
<meta property="og:description" content="${attr(svc.metaDescription)}">
<meta property="og:image" content="${SITE}/og-image-1200x630.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Elevate Digitals - Web Design South Africa">
<meta property="og:site_name" content="Elevate Digitals">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@ElevateDigitals">
<meta name="twitter:title" content="${attr(svc.metaTitle)}">
<meta name="twitter:description" content="${attr(svc.metaDescription)}">
<meta name="twitter:image" content="${SITE}/og-image-1200x630.png">
<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/theme.css">
<link rel="stylesheet" href="/site.css">
</head>
<body>
<a href="#main" class="skip-link">Skip to main content</a>

<header class="site-head">
  <div class="wrap">
    <a href="/" class="logo" aria-label="Elevate Digitals - go to homepage">
      <img src="/brand/logo-horizontal-ink.svg" alt="Elevate Digitals" width="274" height="62">
    </a>
    <a href="/#services" class="head-back">All services</a>
  </div>
</header>

<main id="main">
  <div class="wrap">

    <section class="hero">
      <span class="kicker">${esc(svc.hero.kicker)}</span>
      <h1>${esc(before)}<span class="hl">${esc(hl)}</span>${esc(after)}</h1>
      <p class="lede">${esc(svc.hero.lede)}</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="${attr(waLink(`Hi Kabelo, I'd like to talk about ${svc.name.toLowerCase()} for my business.`))}" target="_blank" rel="noopener noreferrer">${waIcon()} Chat on WhatsApp</a>
        <a class="btn btn-ghost" href="#pricing">See pricing</a>
      </div>
    </section>

    <section class="sec">
      <h2>What's included</h2>
      <p class="sec-sub">Everything below is part of the work, not an upsell once you have started.</p>
      <div class="incl-grid">${included}
      </div>
    </section>

    <section class="sec">
      <h2>Who it's for</h2>
      <ul class="who">
${who}
      </ul>
    </section>

    <section class="sec" id="pricing">
      <h2>Pricing</h2>
      <p class="sec-sub">${esc(svc.pricing.lead)}</p>
      <div class="tiers t${svc.pricing.cols}">${tiers}
      </div>
      ${svc.pricing.note ? `<p class="price-note">${svc.pricing.note}</p>` : ''}

      <div class="assure">
        ${icon('check', 24)}
        <p><strong>See your homepage design before you pay anything.</strong> After a quick call, I'll build your homepage concept free. If you don't want to go ahead after seeing it, you owe nothing.</p>
      </div>
    </section>

    <section class="sec">
      <h2>Questions about ${esc(svc.name.toLowerCase())}</h2>
      <div class="faqs">${faqs}
      </div>
    </section>

    <section class="sec">
      <h2>Other things I do</h2>
      <div class="svc-links">
${otherLinks}
      </div>
    </section>

    <section class="close-cta">
      <h2>Tell me what you need</h2>
      <p>Send a message with what your business does and what you are trying to fix. I'll come back with a straight answer on whether I can help and what it would cost.</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="${attr(waLink(`Hi Kabelo, I'd like to talk about ${svc.name.toLowerCase()} for my business.`))}" target="_blank" rel="noopener noreferrer">${waIcon()} Chat on WhatsApp</a>
        <a class="btn btn-ghost" href="mailto:${EMAIL}">Email instead</a>
      </div>
      <p class="hours">${HOURS}</p>
    </section>

  </div>
</main>

<footer class="site-foot">
  <div class="wrap">
    <div>
      <img src="/brand/logo-horizontal-concrete.svg" alt="Elevate Digitals" width="274" height="62">
      <p class="foot-desc">Modern web design for South African businesses that want to stand out and grow online. Packages from R8,500.</p>
      <p class="foot-contact">
        <a href="mailto:${EMAIL}">${EMAIL}</a><br>
        <a href="tel:+27650858437">${PHONE}</a><br>
        Cape Town, South Africa<br>
        <span class="foot-hours">${HOURS}</span>
      </p>
    </div>
    <div>
      <div class="foot-h">Company</div>
      <ul class="foot-links">
        <li><a href="/">Home</a></li>
        <li><a href="/#services">Services</a></li>
        <li><a href="/#packages">Packages</a></li>
        <li><a href="/#blog">Blog</a></li>
        <li><a href="/#contact">Contact</a></li>
      </ul>
    </div>
    <div>
      <div class="foot-h">Services</div>
      <ul class="foot-links">
${all.map(s => `        <li><a href="/services/${s.slug}">${esc(s.nav)}</a></li>`).join('\n')}
      </ul>
    </div>
    <div>
      <div class="foot-h">Legal</div>
      <ul class="foot-links">
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/refund-policy">Refund Policy</a></li>
      </ul>
    </div>
  </div>
  <div class="foot-bottom">
    <div class="wrap">© 2026 Elevate Digitals. All rights reserved. · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/refund-policy">Refund Policy</a></div>
  </div>
</footer>

<a href="${attr(waLink(`Hi Kabelo, I'd like to talk about ${svc.name.toLowerCase()} for my business.`))}" class="wa-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">${waIcon(27)}</a>
</body>
</html>
`;
}

/* ── printable service menu ─────────────────────────────────────────────
   A link Kabelo sends directly and a PDF he attaches to email. Not in the nav,
   and noindex: it is a document, not a landing page.

   Everything here stays live text. The logo is inlined as SVG markup rather
   than an <img>, because some engines rasterise a referenced SVG when printing
   and the whole point is that the PDF stays vector, editable and small. No
   raster background, no exported image, no web font beyond Archivo. */
function renderMenu(all) {
  // Inlined, and the fixed width/height stripped so CSS can size it. Keeping
  // them would pin the mark at 274px in print.
  const logo = readFileSync('brand/logo-horizontal-ink.svg', 'utf8')
    .replace(/\s(width|height)="[^"]*"/g, '')
    .replace('<svg ', '<svg class="logo" ');

  const contact = `
      <div class="m-contact">
        <span><strong>WhatsApp</strong> <a href="https://wa.me/${WA}">${PHONE}</a></span>
        <span><strong>Email</strong> <a href="mailto:${EMAIL}">${EMAIL}</a></span>
        <span><strong>Web</strong> <a href="${SITE}">elevatedigitals.co.za</a></span>
      </div>`;

  const sections = all.map(svc => {
    const statement = svc.hero.h1.join('');
    const tiers = svc.pricing.tiers.map(t => `
          <div class="m-tier${t.rec ? ' rec' : ''}">
            <div class="m-tier-top">
              <span class="m-tier-name">${esc(t.name)}${t.rec ? '<span class="m-rec">Recommended</span>' : ''}</span>
              <span class="m-tier-price">${price(t.price, { service: svc.name, tier: t.name })}${t.plus ? '+' : ''}${t.per ? `<span class="m-per">/${t.per}</span>` : ''}</span>
            </div>
            <div class="m-tier-period">${esc(t.period)}</div>
            <div class="m-tier-desc">${esc(t.desc)}</div>
            <div class="m-tier-feats">${t.feats.map(esc).join(' &middot; ')}</div>
          </div>`).join('');

    return `
    <section class="m-svc" id="${svc.slug}">
      <header class="m-svc-head">
        <div class="m-svc-kicker">${esc(svc.nav)}</div>
        <h2>${esc(statement)}</h2>
        <p class="m-svc-lede">${esc(svc.hero.lede)}</p>
      </header>

      <div class="m-incl">
        <h3>What's included</h3>
        <ul>${svc.included.map(i => `<li>${esc(i.name)}</li>`).join('')}</ul>
      </div>

      <div class="m-pricing">
        <h3>Pricing</h3>
        <p class="m-pricing-lead">${esc(svc.pricing.lead)}</p>
        ${tiers}
      </div>
${contact}
    </section>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Service Menu | Elevate Digitals</title>
<meta name="description" content="Elevate Digitals service menu: web design, SEO, e-commerce, maintenance, booking systems, copywriting, video editing and brand identity, with pricing in ZAR.">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/brand/favicon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/theme.css">
<style>
/* Menu-only. Not in site.css: the eight service pages have no use for any of
   it, and print rules that nothing else shares are easier to reason about when
   they live next to the only document they format. */
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Archivo',system-ui,sans-serif; background:var(--concrete); color:var(--ink); line-height:1.5; -webkit-font-smoothing:antialiased; }
a { color:inherit; }
.sheet { max-width:820px; margin:0 auto; padding:32px 24px 64px; }

/* ── cover ── */
.m-cover { padding-bottom:28px; border-bottom:2px solid var(--ink); }
.logo { width:230px; height:auto; display:block; }
.m-title { font-size:38px; font-weight:600; letter-spacing:-0.02em; line-height:1.05; margin-top:24px; }
.m-sub { font-size:15px; color:var(--grey); margin-top:10px; max-width:56ch; }
.m-assure { font-size:13.5px; color:var(--ink); margin-top:18px; padding:14px 16px; background:var(--surface); border:1px solid var(--concrete-dark); border-radius:12px; max-width:62ch; }
.m-assure strong { font-weight:600; }
.m-note { font-size:12px; color:var(--grey); margin-top:14px; }
.m-index { list-style:none; columns:2; gap:24px; margin-top:22px; font-size:13.5px; }
.m-index li { padding:4px 0; break-inside:avoid; }
.m-index a { text-decoration:none; color:var(--grey); }
.m-index a:hover { color:var(--ink); }

/* ── a service ── */
.m-svc { padding-top:34px; }
.m-svc-head { border-bottom:1px solid var(--concrete-dark); padding-bottom:14px; }
.m-svc-kicker { font-size:10.5px; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--grey); }
.m-svc h2 { font-size:26px; font-weight:600; line-height:1.15; letter-spacing:-0.015em; margin-top:7px; max-width:24ch; }
.m-svc-lede { font-size:13.5px; color:var(--grey); margin-top:9px; max-width:70ch; }
.m-svc h3 { font-size:10.5px; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--grey); margin-bottom:10px; }

.m-incl { margin-top:20px; }
.m-incl ul { list-style:none; columns:2; gap:26px; }
.m-incl li { position:relative; padding:3px 0 3px 15px; font-size:13px; break-inside:avoid; }
.m-incl li::before { content:'✓'; position:absolute; left:0; font-size:11px; font-weight:700; }

.m-pricing { margin-top:22px; }
.m-pricing-lead { font-size:12.5px; color:var(--grey); margin:-4px 0 14px; max-width:74ch; }
.m-tier { padding:11px 0; border-top:1px solid var(--concrete-dark); break-inside:avoid; }
.m-tier:last-of-type { border-bottom:1px solid var(--concrete-dark); }
.m-tier-top { display:flex; align-items:baseline; justify-content:space-between; gap:16px; }
.m-tier-name { font-size:14px; font-weight:600; letter-spacing:0.02em; }
.m-rec { display:inline-block; margin-left:9px; font-size:8.5px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; background:var(--hivis); color:var(--ink); padding:2px 7px; border-radius:50px; vertical-align:1px; }
.m-tier-price { font-size:19px; font-weight:600; letter-spacing:-0.01em; white-space:nowrap; }
.m-per { font-size:11px; font-weight:500; color:var(--grey); }
.m-tier-period { font-size:11.5px; color:var(--grey); margin-top:1px; }
.m-tier-desc { font-size:12.5px; margin-top:5px; }
.m-tier-feats { font-size:11.5px; color:var(--grey); margin-top:4px; line-height:1.55; }

/* Unset price — deliberately loud so a draft cannot be sent as if it were final. */
.tbc { display:inline-block; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:11px; font-weight:700; letter-spacing:0.04em; border:1.5px dashed var(--ink); border-radius:6px; padding:2px 7px; }

.m-contact { display:flex; flex-wrap:wrap; gap:6px 22px; margin-top:20px; padding-top:12px; border-top:1px solid var(--concrete-dark); font-size:11.5px; color:var(--grey); break-inside:avoid; }
.m-contact strong { color:var(--ink); font-weight:600; }
.m-contact a { text-decoration:none; }

.m-end { margin-top:40px; padding:24px; background:var(--surface); border:1px solid var(--concrete-dark); border-radius:16px; }
.m-end h2 { font-size:22px; font-weight:600; }
.m-end p { font-size:13.5px; color:var(--grey); margin-top:8px; max-width:56ch; }
.m-end .m-contact { border-top:none; margin-top:14px; padding-top:0; font-size:13px; }

/* ── screen-only controls ── */
.bar { position:sticky; top:0; z-index:10; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; background:var(--concrete); border-bottom:1px solid var(--concrete-dark); padding:12px 24px; }
.bar p { font-size:12.5px; color:var(--grey); }
.bar-btn { font-family:inherit; font-size:14px; font-weight:600; background:var(--hivis); color:var(--ink); border:none; border-radius:50px; padding:11px 22px; cursor:pointer; }
.bar-btn:hover { background:var(--hivis-dark); }

@media (max-width:560px) {
  .m-incl ul, .m-index { columns:1; }
  .m-title { font-size:30px; }
  .m-tier-top { flex-direction:column; gap:2px; }
}

/* ══════════ PRINT ══════════
   A4 portrait, one service per page. Everything that only makes sense on a
   screen is removed rather than hidden, so it cannot claim layout. */
@page { size: A4 portrait; margin: 14mm 15mm; }

@media print {
  .bar, .m-index { display:none !important; }

  html, body { background:#fff; }
  body { font-size:9.4pt; line-height:1.45; }
  .sheet { max-width:none; margin:0; padding:0; }

  /* Keep the hi-vis Recommended tag and the card fills — a PDF is the point
     here, and browsers drop background colour from print unless told. */
  * { -webkit-print-color-adjust:exact; print-color-adjust:exact; }

  /* Fill the cover sheet rather than stacking everything at the top and
     leaving two thirds of the page blank. min-height is the A4 content box
     (297mm less the 14mm margins); percentages are unreliable inside @page. */
  .m-cover { break-after:page; padding-bottom:0; border-bottom:none; display:flex; flex-direction:column; min-height:266mm; }
  .m-cover-mid { margin:auto 0; }
  .m-cover .m-contact { margin-top:0; }
  .logo { width:52mm; }
  .m-title { font-size:34pt; }
  .m-sub { font-size:11.5pt; margin-top:5mm; max-width:64ch; }
  .m-assure { font-size:9.5pt; margin-top:8mm; max-width:70ch; }

  /* One service per page. The last must not force a trailing blank sheet. */
  .m-svc { break-before:page; break-inside:auto; padding-top:0; }
  .m-svc h2 { font-size:19pt; max-width:30ch; }
  .m-svc-lede { font-size:9.4pt; }
  .m-svc h3 { font-size:7.5pt; }
  .m-incl li, .m-tier-desc { font-size:9pt; }
  .m-tier-feats, .m-tier-period, .m-contact { font-size:8.4pt; }
  .m-tier-price { font-size:15pt; }
  .m-tier-name { font-size:11pt; }

  /* A heading must never be the last thing on a page. */
  .m-svc-head, .m-incl, .m-pricing h3 + .m-pricing-lead { break-after:avoid; }
  h2, h3 { break-after:avoid; }

  /* No forced break: it is short, and on its own sheet it leaves a page that is
     one-sixth full at the end of a document that gets emailed. It sits under
     the last service when there is room and takes a page of its own only when
     there genuinely is not. */
  .m-end { break-before:auto; break-inside:avoid; border:none; background:none; padding:0; margin-top:7mm; }
  a { text-decoration:none; }
}
</style>
</head>
<body>

<div class="bar">
  <p>Service menu &middot; all prices in South African Rand</p>
  <button class="bar-btn" onclick="window.print()">Save as PDF</button>
</div>

<div class="sheet">

  <header class="m-cover">
    ${logo}
    <div class="m-cover-mid">
      <h1 class="m-title">Service Menu</h1>
      <p class="m-sub">Websites, and the work that keeps them earning, for South African trades and service businesses. Built and looked after by one person in Cape Town.</p>
      <div class="m-assure"><strong>See your homepage design before you pay anything.</strong> After a quick call, I'll build your homepage concept free. If you don't want to go ahead after seeing it, you owe nothing.</div>
      <p class="m-note">All prices in South African Rand. ${HOURS}.</p>
      <ul class="m-index">
${all.map(s => `        <li><a href="#${s.slug}">${esc(s.nav)}</a></li>`).join('\n')}
      </ul>
    </div>
${contact}
  </header>
${sections}

  <section class="m-end">
    <h2>Tell me what you need</h2>
    <p>Send a message with what your business does and what you are trying to fix. I'll come back with a straight answer on whether I can help and what it would cost.</p>
${contact}
    <p class="m-note">${HOURS}</p>
  </section>

</div>
</body>
</html>
`;
}

/* ── injection into hand-written files ──────────────────────────────────
   Everything between the markers is generated; everything outside is yours. */
function inject(text, key, body, file) {
  const open = `<!--BUILD:${key}-->`;
  const close = `<!--/BUILD:${key}-->`;
  const i = text.indexOf(open);
  const j = text.indexOf(close);
  if (i < 0 || j < 0) throw new Error(`${file}: missing ${open} … ${close} markers`);
  return text.slice(0, i + open.length) + '\n' + body + '\n' + text.slice(j);
}

// Homepage service cards. The data-i18n keys are preserved exactly, so all four
// language dictionaries keep working — check-i18n.mjs enforces that.
const homeCards = SERVICES.map(s => {
  const i18nName = s.i18n ? ` data-i18n="${s.i18n}_name"` : '';
  const i18nDesc = s.i18n ? ` data-i18n="${s.i18n}_desc"` : '';
  return `      <a class="svc-card reveal-card" href="/services/${s.slug}">` +
    `<div class="svc-icon" aria-hidden="true">${icon(s.icon, 22)}</div>` +
    `<div class="svc-name"${i18nName}>${esc(s.name)}</div>` +
    `<div class="svc-desc"${i18nDesc}>${esc(s.cardDesc)}</div>` +
    `<ul class="svc-list">${s.cardList.map(l => `<li>${esc(l)}</li>`).join('')}</ul>` +
    `<span class="svc-more">Read more →</span></a>`;
}).join('\n');

const footerServices = SERVICES.map(s =>
  `      <li><a href="/services/${s.slug}">${esc(s.nav)}</a></li>`).join('\n');

// Desktop nav dropdown. Opened on hover and on :focus-within, so it is reachable
// by keyboard without any JS — the top-level Services link still switches to the
// in-page services view for anyone who just clicks it.
const navServices = SERVICES.map(s =>
  `      <li><a href="/services/${s.slug}">${esc(s.nav)}</a></li>`).join('\n');

// Mobile menu. The same links, as a labelled group under the Services entry.
const mobServices = SERVICES.map(s =>
  `    <a class="mob-sub" href="/services/${s.slug}">${esc(s.nav)}</a>`).join('\n');

const sitemapEntries = SERVICES.map(s => `  <url>
    <loc>${SITE}/services/${s.slug}</loc>
    <lastmod>2026-08-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

/* ── run ── */
export function build({ write = true } = {}) {
  tbc.clear();
  const out = new Map();

  for (const svc of SERVICES) out.set(`services/${svc.slug}.html`, renderPage(svc, SERVICES));
  out.set('menu.html', renderMenu(SERVICES));

  let index = readFileSync('index.html', 'utf8');
  index = inject(index, 'svc-grid', homeCards, 'index.html');
  index = inject(index, 'foot-services', footerServices, 'index.html');
  index = inject(index, 'nav-services', navServices, 'index.html');
  index = inject(index, 'mob-services', mobServices, 'index.html');
  out.set('index.html', index);

  let sitemap = readFileSync('sitemap.xml', 'utf8');
  sitemap = inject(sitemap, 'services', sitemapEntries, 'sitemap.xml');
  out.set('sitemap.xml', sitemap);

  if (write) {
    mkdirSync('services', { recursive: true });
    for (const [path, body] of out) writeFileSync(path, body);
  }
  return { out, tbc: [...tbc] };
}

// pathToFileURL, not a template string: the repo path contains spaces, and a
// raw `file://${argv[1]}` never matches the percent-encoded import.meta.url.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { out, tbc } = build();
  for (const path of out.keys()) console.log('wrote', path);
  if (tbc.length) {
    console.log(`\n⚠  ${tbc.length} price placeholder${tbc.length === 1 ? '' : 's'} still to fill in before publishing:`);
    for (const t of tbc) console.log('   PRICE_TBC  ' + t);
    console.log('\n   Set them in lib/services.js, then re-run: node build.mjs');
  } else {
    console.log('\nno price placeholders outstanding');
  }
}
