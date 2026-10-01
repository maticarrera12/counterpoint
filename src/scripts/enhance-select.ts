// Progressively replaces each `<select>` inside a `[data-enhance-select]` wrapper with a
// custom-styled button + listbox, so the open dropdown matches the site instead of the OS's
// native popup. The original <select> stays in the DOM (visually hidden, `aria-hidden`) and
// remains the real form control: its `name`/`value`/`required` keep working exactly as before,
// and without JS the native select still renders and submits normally.

const TRIGGER_CLASS =
  'flex w-full items-center justify-between gap-2 bg-transparent border-0 border-b-2 border-divider rounded-none px-0 py-3 text-left text-[clamp(16px,1.4vw,20px)] leading-[1.4] text-text cursor-pointer transition-colors duration-300 focus-visible:outline-none focus-visible:border-accent aria-[invalid=true]:border-accent';

const LIST_CLASS =
  'dd-list absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-auto border border-divider bg-bg shadow-[0_10px_30px_rgba(0,0,0,0.12)]';

const OPTION_CLASS =
  'dd-option block cursor-pointer px-4 py-2.5 text-[14px] leading-[1.4] text-text';

function enhance(wrapper: HTMLElement) {
  const select = wrapper.querySelector('select');
  if (!select || select.options.length === 0) return;

  // The disabled placeholder ("Elegí una opción") stays as the initial label but isn't a real
  // choice, so it's left out of the list — matching a required field that starts unanswered.
  const options = Array.from(select.options).filter((o) => !o.disabled);
  const listId = `${select.id}-listbox`;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = TRIGGER_CLASS;
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', listId);
  if (select.hasAttribute('aria-describedby')) {
    trigger.setAttribute('aria-describedby', select.getAttribute('aria-describedby')!);
  }

  const label = document.createElement('span');
  label.className = 'truncate';
  trigger.append(label);

  const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  chevron.setAttribute('aria-hidden', 'true');
  chevron.setAttribute('width', '14');
  chevron.setAttribute('height', '14');
  chevron.setAttribute('viewBox', '0 0 14 14');
  chevron.setAttribute('fill', 'none');
  chevron.classList.add('shrink-0', 'text-accent', 'transition-transform', 'duration-200');
  chevron.innerHTML =
    '<path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />';
  trigger.append(chevron);

  const list = document.createElement('ul');
  list.id = listId;
  list.role = 'listbox';
  list.tabIndex = -1;
  list.className = LIST_CLASS;
  list.hidden = true;

  const items = options.map((opt) => {
    const li = document.createElement('li');
    li.role = 'option';
    li.id = `${listId}-${opt.value || 'empty'}`;
    li.dataset.value = opt.value;
    li.className = OPTION_CLASS;
    li.textContent = opt.label;
    if (opt.disabled) li.setAttribute('aria-disabled', 'true');
    list.append(li);
    return li;
  });

  const setLabel = () => {
    const current = select.options[select.selectedIndex];
    const isPlaceholder = !current || current.disabled || current.value === '';
    label.textContent = current ? current.label : '';
    label.classList.toggle('text-muted', isPlaceholder);
    label.classList.toggle('text-text', !isPlaceholder);
  };

  const setActive = (index: number) => {
    items.forEach((li, i) => {
      const on = i === index;
      li.classList.toggle('bg-accent', on);
      li.classList.toggle('text-bg', on);
      li.setAttribute('aria-selected', String(select.options[i]?.value === select.value));
    });
    if (index >= 0) list.setAttribute('aria-activedescendant', items[index].id);
  };

  let activeIndex = -1;

  const openList = () => {
    list.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    chevron.classList.add('rotate-180');
    const current = options.findIndex((o) => o.value === select.value);
    activeIndex = current >= 0 ? current : options.findIndex((o) => !o.disabled);
    setActive(activeIndex);
  };

  const closeList = (focusTrigger = false) => {
    list.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    chevron.classList.remove('rotate-180');
    if (focusTrigger) trigger.focus();
  };

  const choose = (index: number) => {
    const opt = options[index];
    if (!opt || opt.disabled) return;
    select.value = opt.value;
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
    setLabel();
    closeList();
  };

  trigger.addEventListener('click', () => {
    if (list.hidden) openList();
    else closeList();
  });

  trigger.addEventListener('keydown', (e) => {
    if (list.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      openList();
    }
  });

  list.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      setActive(activeIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      setActive(activeIndex);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(activeIndex);
      trigger.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeList(true);
    } else if (e.key === 'Tab') {
      closeList();
    }
  });

  items.forEach((li, i) => {
    li.addEventListener('click', () => {
      choose(i);
      trigger.focus();
    });
    li.addEventListener('mouseenter', () => {
      activeIndex = i;
      setActive(activeIndex);
    });
  });

  document.addEventListener('click', (e) => {
    if (!list.hidden && !wrapper.contains(e.target as Node)) closeList();
  });

  // Keep the visible trigger's invalid/focus styling in sync with the real (hidden) select.
  new MutationObserver(() => {
    const invalid = select.getAttribute('aria-invalid');
    if (invalid) trigger.setAttribute('aria-invalid', invalid);
    else trigger.removeAttribute('aria-invalid');
  }).observe(select, { attributes: true, attributeFilter: ['aria-invalid'] });

  select.classList.add('sr-only');
  select.setAttribute('aria-hidden', 'true');
  select.tabIndex = -1;

  setLabel();
  wrapper.append(trigger, list);
}

document.querySelectorAll<HTMLElement>('[data-enhance-select]').forEach(enhance);
