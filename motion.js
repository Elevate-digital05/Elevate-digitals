/* Elevate Digitals — motion behaviour, ported from the Prismatic Syntax build.

   Three things live here: the reveal observer that drives [data-reveal] and
   [data-split], the line numbering the split headlines need, and the sticky
   header's scrolled/hidden states. All of it is a no-op on a page that uses
   none of those hooks, so every page can link the same file.

   index.html swaps pages without a reload, so initMotion() is exposed and
   called again after each swap. It only ever observes elements that have not
   already played, which makes repeat calls cheap and safe. */
(function () {
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── sticky header ──
     Frost the bar once the page has moved, and lift it out of the way while
     the reader scrolls down. The 480px floor stops it hiding during the small
     scroll that a jump-link or an opening menu causes. Under reduced motion
     the frost still applies; only the movement is dropped, in CSS. */
  const head = document.querySelector('.site-head, [data-sticky-head]');
  if (head) {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      head.classList.toggle('is-scrolled', y > 40);
      head.classList.toggle(
        'is-hidden',
        y > 480 && y > lastY && !document.body.classList.contains('menu-open')
      );
      lastY = y;
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── reveal ──
     rootMargin pulls the trigger up by a tenth of the viewport so a section
     starts moving just before it is fully in view, rather than after. */
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -10% 0px' });

  function initMotion(root = document) {
    for (const h of $$('[data-split]', root)) {
      $$('.line', h).forEach((l, i) => l.style.setProperty('--i', i));
    }
    for (const el of $$('[data-reveal],[data-split]', root)) {
      if (!el.classList.contains('is-in')) io.observe(el);
    }
  }
  window.initMotion = initMotion;

  /* Wait for the display face before observing, so a late webfont cannot
     reflow a headline into different lines halfway through its reveal. The
     race caps that wait: a slow font must not hold the whole page invisible.
     The double rAF lets the first paint land before anything starts. */
  Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 800))])
    .then(() => requestAnimationFrame(() => requestAnimationFrame(() => initMotion())));

  /* Anything still unobserved when the tab was hidden on load gets picked up
     on return, otherwise a background-loaded page shows its content already
     faded out with nothing to trigger it. */
  addEventListener('pageshow', e => { if (e.persisted) initMotion(); });

  if (reduced) document.documentElement.classList.add('reduced-motion');
})();
