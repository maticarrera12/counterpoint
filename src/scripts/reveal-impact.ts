const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-imp-row]'));

if (!reduceMotion && rows.length && 'IntersectionObserver' in window) {
  // The hidden states in CSS only exist under .imp-ready, so no-JS and reduced motion see everything.
  rows[0].closest('section')?.classList.add('imp-ready');

  const observer = new IntersectionObserver(
    (items) => {
      for (const item of items) {
        if (item.isIntersecting) {
          item.target.classList.add('imp-in');
        } else if (item.boundingClientRect.top > 0) {
          // Left through the bottom edge (scrolling up): play back.
          item.target.classList.remove('imp-in');
        }
      }
    },
    { rootMargin: '0px 0px -15% 0px', threshold: 0 },
  );

  rows.forEach((row) => observer.observe(row));
}
