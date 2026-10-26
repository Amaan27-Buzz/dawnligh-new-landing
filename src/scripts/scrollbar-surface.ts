// Classic scrollbars expose the canvas, rather than the content behind a transparent track.
// Paint that backing from the visible page edge; scrolling and the thumb stay browser-native.
export function setupScrollbarSurface(): void {
  const root = document.documentElement;
  const sections = [...document.querySelectorAll<HTMLElement>('.research-practice,.about-thinking,.project-approach,.site-footer,[data-closing]')];
  const header = document.querySelector<HTMLElement>('.site-header');
  if (header) sections.push(header);
  const paper = getComputedStyle(root).getPropertyValue('--paper').trim();
  let frame = 0;
  const paint = () => {
    frame = 0;
    const height = innerHeight;
    const edge = document.body.getBoundingClientRect().right - 1;
    const surfaces = sections.flatMap(section => {
      const rect = section.getBoundingClientRect();
      const style = getComputedStyle(section);
      if (rect.right < edge || rect.bottom <= 0 || rect.top >= height || style.visibility === 'hidden') return [];
      const top = Math.max(0, rect.top + (parseFloat(style.borderTopRightRadius) || 0));
      const bottom = Math.min(height, rect.bottom - (parseFloat(style.borderBottomRightRadius) || 0));
      return bottom > top ? [{ top, bottom, color: style.backgroundColor }] : [];
    });
    const colorAt = (y: number) => surfaces.findLast(surface => y >= surface.top && y < surface.bottom)?.color ?? paper;
    const edges = [...new Set([0, height, ...surfaces.flatMap(surface => [surface.top, surface.bottom])])].sort((a,b) => a-b);
    const stops = edges.slice(0,-1).flatMap((top,index) => {
      const bottom = edges[index+1];
      const color = colorAt((top+bottom)/2);
      return [`${color} ${top}px`, `${color} ${bottom}px`];
    });
    root.style.setProperty('--scrollbar-backdrop', `linear-gradient(to bottom,${stops.join(',')})`);
    root.style.setProperty('--scrollbar-canvas', colorAt(height/2));
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  new ResizeObserver(schedule).observe(document.body);
  void document.fonts.ready.then(schedule);
  paint();
}
