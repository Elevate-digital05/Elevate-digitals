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

  /* ── FAQ accordion ──
     A <details> hides its own content the moment `open` is removed, so a
     collapse never gets to animate. Opening needs no help: `open` goes on, the
     content becomes visible, and the grid track in motion.css eases it down.
     Closing is the case that needs holding — keep the element open, mark it
     .is-closing so the track runs back to 0fr, and only then let it shut. */
  function initFaq(root = document) {
    for (const sum of $$('.faq > summary', root)) {
      if (sum.dataset.faqBound) continue;
      sum.dataset.faqBound = '1';
      sum.addEventListener('click', e => {
        const d = sum.parentElement;
        const body = d.querySelector('.faq__body');
        if (reduced || !body) return;           // native toggle, no animation

        // mid-collapse and clicked again: abandon the close, stay open
        if (d.classList.contains('is-closing')) {
          e.preventDefault();
          d.classList.remove('is-closing');
          return;
        }
        if (!d.open) return;                    // opening needs no intervention

        e.preventDefault();
        d.classList.add('is-closing');
        let shut = false;
        const finish = () => {
          if (shut) return;
          shut = true;
          body.removeEventListener('transitionend', onEnd);
          // a second click may already have cancelled the collapse
          if (d.classList.contains('is-closing')) {
            d.classList.remove('is-closing');
            d.open = false;
          }
        };
        const onEnd = ev => { if (ev.propertyName === 'grid-template-rows') finish(); };
        body.addEventListener('transitionend', onEnd);
        // transitionend never fires on a hidden or display:none element, and a
        // question stuck half-shut is worse than one that closes unanimated
        setTimeout(finish, 600);
      });
    }
  }

  function initMotion(root = document) {
    for (const h of $$('[data-split]', root)) {
      $$('.line', h).forEach((l, i) => l.style.setProperty('--i', i));
    }
    for (const el of $$('[data-reveal],[data-split]', root)) {
      if (!el.classList.contains('is-in')) io.observe(el);
    }
    initFaq(root);
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
