import { setupDawnScrollbar } from './dawn-scrollbar';

export function setupSiteInteractions(): void {
  setupDawnScrollbar();
  // Keep the browser's native scrollbar, wheel, touch and keyboard semantics.
  // This is a visual reading-position indicator, not scroll hijacking.
  const root = document.documentElement;
  let scheduled = false;
  const updateProgress = () => {
    scheduled = false;
    const max = root.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    root.style.setProperty('--scroll-progress', progress.toFixed(5));
    root.style.setProperty('--scroll-percent', progress.toFixed(5));
  };
  const requestProgress = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateProgress);
  };
  window.addEventListener('scroll', requestProgress, { passive: true });
  window.addEventListener('resize', requestProgress, { passive: true });
  window.addEventListener('load', requestProgress, { once: true });
  requestProgress();

  document.querySelectorAll<HTMLElement>('[data-project-experience]').forEach(experience => {
    const buttons = [...experience.querySelectorAll<HTMLButtonElement>('[data-experience-step]')];
    const counter = experience.querySelector<HTMLElement>('[data-experience-counter]');
    const tag = experience.querySelector<HTMLElement>('[data-experience-tag]');
    const labels = ['CONTEXT LAYER','TOOL CONNECTIONS','WORKER SYSTEM'];
    const tagsBySlug: Record<string,string[]> = {
      oscar: labels,
      takokit: ['SPEECH-TO-TEXT','TEXT-TO-SPEECH','RUNTIME LAYER'],
      kinetable: ['COMPONENT SPACE','CONNECTION MAP','EXPLORATION'],
      aish: ['USER INTENT','VISIBLE COMMANDS','USER APPROVAL'],
    };
    const labelsForPage = tagsBySlug[experience.dataset.projectExperience ?? ''] ?? labels;
    const choose = (index: number) => {
      if (index < 0 || index >= buttons.length) return;
      experience.dataset.experiencePhase = String(index);
      buttons.forEach((button, i) => {
        button.classList.toggle('is-active', i === index);
        button.setAttribute('aria-pressed', String(i === index));
      });
      if (counter) counter.textContent = String(index+1);
      if (tag) tag.textContent = labelsForPage[index];
    };
    experience.dataset.experiencePhase = '0';
    buttons.forEach((button,index) => {
      button.addEventListener('click', () => choose(index));
      button.addEventListener('focus', () => choose(index));
    });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        experience.classList.toggle('is-paused', !entries[0]?.isIntersecting || document.hidden);
      }, { threshold: .03 });
      observer.observe(experience);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) experience.classList.add('is-paused');
        else if (experience.getBoundingClientRect().bottom > 0 &&
          experience.getBoundingClientRect().top < window.innerHeight) experience.classList.remove('is-paused');
      });
    }
  });

  const copyButton = document.querySelector<HTMLButtonElement>('[data-copy-email]');
  const copyStatus = document.querySelector<HTMLElement>('[data-copy-status]');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const address = copyButton.dataset.copyEmail ?? '';
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(address);
        if (copyStatus) copyStatus.textContent = 'Email address copied.';
        copyButton.textContent = 'Copied';
      } catch {
        if (copyStatus) copyStatus.textContent = 'Copy unavailable. Select the email address to copy it.';
      }
    });
  }

  const topButton = document.querySelector<HTMLButtonElement>('[data-back-to-top]');
  topButton?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
}
