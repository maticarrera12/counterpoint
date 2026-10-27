// Generic scroll reveal. Elements marked `data-reveal="<kind>"` get `.is-in` once, when they
// reach the trigger line; the hidden state and the entrance live in global.css and only exist
// under <html class="js"> with motion allowed. A parent with `data-reveal-stagger[="<ms>"]`
// staggers its `[data-reveal]` children; an inline `--rd` on an element wins over that.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

const DEFAULT_STEP = 70;
const MAX_DELAY = 420;

if (reduceMotion || !('IntersectionObserver' in window)) {
  targets.forEach((el) => el.classList.add('is-in'));
} else {
  for (const el of targets) {
    const parent = el.parentElement;
    if (!parent?.hasAttribute('data-reveal-stagger') || el.style.getPropertyValue('--rd')) continue;
    const step = Number(parent.dataset.revealStagger) || DEFAULT_STEP;
    const index = Array.from(parent.children).filter((c) => c.hasAttribute('data-reveal')).indexOf(el);
    el.style.setProperty('--rd', `${Math.min(index * step, MAX_DELAY)}ms`);
  }

  const observer = new IntersectionObserver(
    (items) => {
      for (const item of items) {
        // Also reveal what is already above the viewport (anchor jumps, restored scroll) so it
        // isn't left hidden when the reader scrolls back up.
        if (item.isIntersecting || item.boundingClientRect.top < 0) {
          item.target.classList.add('is-in');
          observer.unobserve(item.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0 },
  );

  targets.forEach((el) => observer.observe(el));
}
