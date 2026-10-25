/** Branded scrollbar for desktop pointer devices; document scroll remains native. */
export function setupDawnScrollbar(): void {
  const root = document.documentElement;
  const control = document.querySelector<HTMLElement>('[data-dawn-scrollbar]');
  const thumb = control?.querySelector<HTMLElement>('[data-dawn-scrollbar-thumb]');
  if (!control || !thumb) return;
  const desktop = window.matchMedia(
    '(min-width: 1060px) and (pointer: fine) and (hover: hover) and (forced-colors: none)'
  );
  let enabled = false;
  let raf = 0;
  let travel = 0;
  let maxScroll = 0;
  let thumbHeight = 64;
  let dragOffset = 0;
  let dragging = false;

  // The compositor owns the thumb's transform. Avoid any animation lag,
  // including when ScrollTrigger pins a section and changes page length.
  const measure = () => {
    maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
    const trackHeight = control.clientHeight;
    thumbHeight = trackHeight > 0
      ? Math.min(trackHeight, Math.max(54, trackHeight * window.innerHeight / Math.max(root.scrollHeight,1)))
      : 54;
    travel = Math.max(0, trackHeight - thumbHeight);
    control.style.setProperty('--thumb-height', thumbHeight.toFixed(2) + 'px');
    control.dataset.scrollable = maxScroll > 2 ? 'true' : 'false';
    control.tabIndex = maxScroll > 2 ? 0 : -1;
    paint();
  };

  const paint = () => {
    const fraction = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    control.style.setProperty('--thumb-y', (fraction * travel).toFixed(2) + 'px');
    const progress = Math.round(fraction * 100);
    control.setAttribute('aria-valuenow', String(progress));
    control.setAttribute('aria-valuetext', progress === 0 ? 'Top of page'
      : progress === 100 ? 'Bottom of page' : progress + '% through page');
  };

  const schedulePaint = () => {
    if (!enabled || raf) return;
    raf = window.requestAnimationFrame(() => { raf = 0; paint(); });
  };

  const setEnabled = () => {
    enabled = desktop.matches;
    root.classList.toggle('dawn-scrollbar-ready', enabled);
    if (!enabled) {
      control.classList.remove('is-dragging');
      dragging = false;
      return;
    }
    // Measure after the native scrollbar disappears, preventing a
    // one-frame mismatch between actual document height and thumb size.
    window.requestAnimationFrame(measure);
  };

  const moveTo = (clientY: number) => {
    if (!enabled || maxScroll <= 0) return;
    const rect = control.getBoundingClientRect();
    const top = Math.max(0, Math.min(travel, clientY - rect.top - dragOffset));
    const fraction = travel > 0 ? top / travel : 0;
    window.scrollTo({ top: maxScroll * fraction, behavior: 'instant' });
    paint();
  };

  control.addEventListener('pointerdown', event => {
    if (!enabled || event.button !== 0 || maxScroll <= 0) return;
    event.preventDefault();
    const rect = control.getBoundingClientRect();
    const thumbTop = rect.top + ((window.scrollY / maxScroll) * travel);
    // Thumb drag preserves pointer offset; track click centers the thumb.
    const onThumb = event.clientY >= thumbTop && event.clientY <= thumbTop + thumbHeight;
    dragOffset = onThumb ? event.clientY - thumbTop : thumbHeight / 2;
    dragging = true;
    control.classList.add('is-dragging');
    control.setPointerCapture(event.pointerId);
    moveTo(event.clientY);
  });
  control.addEventListener('pointermove', event => {
    if (dragging) { event.preventDefault(); moveTo(event.clientY); }
  });
  const finishDrag = (event: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    control.classList.remove('is-dragging');
    if (control.hasPointerCapture(event.pointerId)) control.releasePointerCapture(event.pointerId);
  };
  control.addEventListener('pointerup', finishDrag);
  control.addEventListener('pointercancel', finishDrag);
  control.addEventListener('lostpointercapture', () => {
    dragging = false;
    control.classList.remove('is-dragging');
  });
  control.addEventListener('keydown', event => {
    if (!enabled || maxScroll <= 0) return;
    const step = 70;
    const page = Math.round(window.innerHeight * .82);
    let target: number;
    switch (event.key) {
      case 'ArrowDown': target = window.scrollY + step; break;
      case 'ArrowUp': target = window.scrollY - step; break;
      case 'PageDown': target = window.scrollY + page; break;
      case 'PageUp': target = window.scrollY - page; break;
      case 'Home': target = 0; break;
      case 'End': target = maxScroll; break;
      default: return;
    }
    event.preventDefault();
    window.scrollTo({ top: Math.max(0, Math.min(maxScroll, target)), behavior: 'instant' });
    paint();
  });

  window.addEventListener('scroll', schedulePaint, { passive:true });
  window.addEventListener('resize', measure, { passive:true });
  window.addEventListener('load', measure, { once:true });
  desktop.addEventListener('change', setEnabled);
  // ScrollTrigger may add pin spacers after layout. A resize observer keeps
  // the thumb proportional without polling or altering scroll behaviour.
  const observer = new ResizeObserver(() => {
    if (enabled) measure();
  });
  observer.observe(root);
  observer.observe(document.body);
  setEnabled();
}
