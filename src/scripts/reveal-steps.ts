const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Each step is the first cell of a grid row inside [data-steps]: a title followed by its text.
const steps = Array.from(document.querySelectorAll<HTMLElement>('[data-steps] .grid > div:first-child'));

if (!reduceMotion && steps.length && 'IntersectionObserver' in window) {
  for (const step of steps) {
    const [title, text] = Array.from(step.children) as HTMLElement[];

    // Reuse the section-title line mask so the step title enters the same way.
    if (title) {
      const mask = document.createElement('span');
      mask.className = 'rv-line';
      const inner = document.createElement('span');
      inner.className = 'rv-line-i';
      inner.style.setProperty('--rv-in', '0ms');
      inner.style.setProperty('--rv-out', '60ms');
      inner.append(...Array.from(title.childNodes));
      mask.append(inner);
      title.append(mask);
    }
    text?.classList.add('st-text');
  }

  const observer = new IntersectionObserver(
    (items) => {
      for (const item of items) {
        if (item.isIntersecting) {
          item.target.classList.add('rv-in');
        } else if (item.boundingClientRect.top > 0) {
          // Left through the bottom edge (scrolling up): play back in reverse.
          item.target.classList.remove('rv-in');
        }
      }
    },
    { rootMargin: '0px 0px -15% 0px', threshold: 0 },
  );

  steps.forEach((step) => observer.observe(step));
}
