const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const section = document.getElementById('trabajo');
const cases = section ? Array.from(section.querySelectorAll<HTMLElement>(':scope > .grid')) : [];

const STEP = 140;

if (section && !reduceMotion && cases.length && 'IntersectionObserver' in window) {
  for (const grid of cases) {
    // Skip empty spacer cells; everything else fades in one after another.
    const cells = Array.from(grid.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && (el.textContent?.trim() !== '' || !!el.querySelector('img')),
    );
    cells.forEach((el, i) => {
      el.dataset.wk = '';
      el.style.setProperty('--d', `${i * STEP}ms`);
    });
  }

  // The hidden state in CSS only exists under .wk-ready, so no-JS and reduced motion see everything.
  section.classList.add('wk-ready');

  const observer = new IntersectionObserver(
    (items) => {
      for (const item of items) {
        if (item.isIntersecting) {
          item.target.classList.add('wk-in');
        } else if (item.boundingClientRect.top > 0) {
          // Left through the bottom edge (scrolling up): fade back out.
          item.target.classList.remove('wk-in');
        }
      }
    },
    { rootMargin: '0px 0px -15% 0px', threshold: 0 },
  );

  cases.forEach((grid) => observer.observe(grid));
}
