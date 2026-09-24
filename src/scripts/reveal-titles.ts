const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const titles = Array.from(document.querySelectorAll<HTMLElement>('section h2'));

const LINE_STEP = 90;

type Word = { text: string; chain: HTMLElement[] };

// Splits the title into plain inline words (keeping inline wrappers such as the italic accent)
// so the browser tells us where each visual line breaks.
function measureLines(root: HTMLElement): Word[][] {
  const words: { el: HTMLElement; word: Word }[] = [];

  const walk = (node: Node, chain: HTMLElement[]) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const part of (child.textContent ?? '').split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.append(document.createTextNode(' '));
            continue;
          }
          const el = document.createElement('span');
          el.style.display = 'inline-block';
          el.textContent = part;
          words.push({ el, word: { text: part, chain: [...chain] } });
          frag.append(el);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
        walk(child, [child as HTMLElement, ...chain]);
      }
    }
  };
  walk(root, []);

  const lines: Word[][] = [];
  let lastTop = -Infinity;
  for (const { el, word } of words) {
    const top = el.getBoundingClientRect().top;
    if (top - lastTop > 2) lines.push([]);
    lastTop = top;
    lines[lines.length - 1].push(word);
  }
  return lines;
}

// Rebuilds the title as one block per visual line. Each line is a single unit that slides in
// from the left; the exit delays mirror the entry so scrolling back up plays it in reverse.
function buildLines(root: HTMLElement, lines: Word[][]) {
  root.textContent = '';

  lines.forEach((words, l) => {
    const mask = document.createElement('span');
    mask.className = 'rv-line';
    const inner = document.createElement('span');
    inner.className = 'rv-line-i';
    inner.style.setProperty('--rv-in', `${l * LINE_STEP}ms`);
    inner.style.setProperty('--rv-out', `${(lines.length - 1 - l) * LINE_STEP}ms`);

    words.forEach((word, i) => {
      if (i > 0) inner.append(document.createTextNode(' '));
      let node: Node = document.createTextNode(word.text);
      for (const ancestor of word.chain) {
        const wrapper = ancestor.cloneNode(false) as HTMLElement;
        wrapper.append(node);
        node = wrapper;
      }
      inner.append(node);
    });

    mask.append(inner);
    root.append(mask);
  });
}

if (!reduceMotion && titles.length && 'IntersectionObserver' in window) {
  const originals = new Map(titles.map((el) => [el, el.innerHTML]));

  const layout = (el: HTMLElement) => {
    el.innerHTML = originals.get(el) ?? el.innerHTML;
    buildLines(el, measureLines(el));
  };
  const layoutAll = () => titles.forEach(layout);

  layoutAll();
  document.fonts?.ready.then(layoutAll);

  let resizeTimer: number | undefined;
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(layoutAll, 150);
  });

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

  titles.forEach((el) => observer.observe(el));
}
