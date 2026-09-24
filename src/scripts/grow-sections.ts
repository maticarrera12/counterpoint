const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-grow]'));

const START_SCALE = 0.93;
// Fraction of the viewport height the section travels while it opens up to full width.
const TRAVEL = 0.45;

const clamp = (n: number) => Math.min(1, Math.max(0, n));

// Scroll-linked: progress is 0 when the section's top edge enters the bottom of the viewport
// and 1 once it has risen TRAVEL of the viewport. The top edge is the transform origin, so its
// position (and this measurement) is unaffected by the scale.
function update() {
  const vh = window.innerHeight;
  for (const el of sections) {
    const progress = clamp((vh - el.getBoundingClientRect().top) / (vh * TRAVEL));
    if (progress >= 1) {
      el.style.transform = '';
    } else {
      el.style.transform = `scale(${START_SCALE + (1 - START_SCALE) * progress})`;
    }
  }
}

if (!reduceMotion && sections.length) {
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}
