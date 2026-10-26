const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function setupResearchAtlases(): void {
  document.querySelectorAll<HTMLElement>('[data-research-atlas]').forEach(atlas => {
    const buttons = [...atlas.querySelectorAll<HTMLButtonElement>('[data-atlas-trigger]')];
    const scenes = [...atlas.querySelectorAll<SVGGElement>('[data-atlas-scene]')];
    const description = atlas.querySelector<HTMLElement>('[data-atlas-description]');
    const counter = atlas.querySelector<HTMLElement>('[data-atlas-counter]');
    const stage = atlas.querySelector<HTMLElement>('.research-atlas__stage');
    if (!buttons.length || scenes.length !== buttons.length) return;

    let current = 0;
    function activate(index: number): void {
      if (index === current || index < 0 || index >= buttons.length) return;
      current = index;
      buttons.forEach((button, i) => {
        button.classList.toggle('is-active', i === index);
        button.setAttribute('aria-pressed', String(i === index));
      });
      scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === index));
      if (description) description.textContent =
        buttons[index].querySelector('.research-atlas__detail')?.textContent ?? '';
      if (counter) counter.textContent = String(index + 1).padStart(2, '0');
    }

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(index));
      button.addEventListener('focus', () => activate(index));
    });

    if (stage && !reduced()) {
      stage.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch') return;
        const r = stage.getBoundingClientRect();
        stage.style.setProperty('--ax', ((event.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        stage.style.setProperty('--ay', ((event.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      }, { passive: true });
      stage.addEventListener('pointerleave', () => {
        stage.style.setProperty('--ax', '50%');
        stage.style.setProperty('--ay', '45%');
      });
    }
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        atlas.classList.toggle('is-paused', !entries[0]?.isIntersecting || document.hidden);
      }, { threshold: .05 });
      observer.observe(atlas);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) atlas.classList.add('is-paused');
        else if (atlas.getBoundingClientRect().bottom > 0 &&
                 atlas.getBoundingClientRect().top < window.innerHeight) atlas.classList.remove('is-paused');
      });
    }
  });
}
