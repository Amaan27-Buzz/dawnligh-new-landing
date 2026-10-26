import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

import { setupWritingArchive } from './writing-archive';
import { setupSketches } from './sketches';
import { setupMotion } from './motion';
import { setupScrollbarSurface } from './scrollbar-surface';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;
  nav.inert = window.innerWidth <= 760;
  const background = document.querySelectorAll<HTMLElement>('main, .site-footer, [data-closing]');
  const close = () => {
    background.forEach(element => { element.inert = false; });
    document.body.classList.remove('menu-open');
    nav.inert = window.innerWidth <= 760;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  };
  toggle.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    nav.inert = !open;
    background.forEach(element => { element.inert = open; });
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', event => {
    if (!document.body.classList.contains('menu-open')) return;
    if (event.key === 'Escape') { close(); toggle.focus(); }
    if (event.key === 'Tab') {
      const links = nav.querySelectorAll<HTMLAnchorElement>('a');
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === toggle) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle.focus(); }
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) close();
    else nav.inert = !document.body.classList.contains('menu-open');
  }, { passive: true });
}

function setupIntroduction(): void {
  const intro = document.querySelector<HTMLElement>('[data-intro]');
  if (!intro) return;
  if (reducedMotion) { intro.remove(); return; }

  const mark = intro.querySelector<HTMLElement>('[data-intro-mark]');
  const words = intro.querySelector<HTMLElement>('[data-intro-words]');
  if (!mark || !words) { intro.remove(); return; }
  const finish = () => {
    intro.remove();
    document.documentElement.dataset.introComplete = 'true';
    document.dispatchEvent(new Event('dawnlight:intro-complete'));
  };
  // A failed module cannot leave a permanent overlay; CSS also has an exit.
  const fallback = window.setTimeout(finish, 5000);
  const tl = gsap.timeline({ onComplete: () => { clearTimeout(fallback); finish(); } });
  tl.fromTo(mark, { opacity: 0, scale: .9 },
      { opacity: 1, scale: 1, duration: .7, ease: 'power3.out' }, 0)
    .fromTo(intro.querySelector('.swipe-lead'), { x: -430, y: -410 },
      { x: 0, y: 0, duration: 1.25, ease: 'power3.out' }, .12)
    .fromTo(intro.querySelectorAll('.swipe-trail'), { x: -410, y: -390 },
      { x: 0, y: 0, duration: 1.65, ease: 'power3.out' }, .23)
    .fromTo(intro.querySelector('.parallax-mid'), { x: 95, y: 50 },
      { x: 0, y: 0, duration: 1.8, ease: 'power3.out' }, 0)
    .fromTo(intro.querySelector('.parallax-core'), { x: 160, y: 90 },
      { x: 0, y: 0, duration: 1.8, ease: 'power3.out' }, 0)
    .fromTo(intro.querySelector('.parallax-rim'), { x: -70, y: -40 },
      { x: 0, y: 0, duration: 1.8, ease: 'power3.out' }, 0)
    .fromTo(words, { opacity: 0, y: 14, clipPath: 'inset(0 100% 0 0)' },
      { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: .8, ease: 'power2.out' }, 1.05)
    .to(intro, { opacity: 0, duration: .65, ease: 'power2.inOut' }, 2.4);
}

function setupFinale(): void {
  const closing = document.querySelector<HTMLElement>('[data-closing]');
  if (!closing || reducedMotion) return;
  const orb = closing.querySelector<SVGGElement>('.closing__satellite');
  const sun = closing.querySelector<SVGGElement>('.closing__sun');
  const name = closing.querySelector<HTMLElement>('.closing__name');
  const tracks = closing.querySelectorAll('.closing__orbit-track');
  if (!orb || !sun || !name) return;

  // SVG viewBox coordinates keep the same orbit at every screen size.
  // One body, one source: no front/back duplicates or final-frame replacement.
  ScrollTrigger.create({
    trigger: closing, start: 'top top', end: 'bottom top',
    toggleClass: { targets: document.documentElement, className: 'finale-active' },
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: closing, start: 'top bottom', end: 'bottom bottom',
      scrub: .45, invalidateOnRefresh: true,
    },
    defaults: { ease: 'sine.inOut' },
  })
    .fromTo(sun, { scale: .78, opacity: .25, svgOrigin: '291 314' },
      { scale: 1, opacity: 1, duration: .32 }, 0)
    .fromTo(orb, { x: -260, y: -80, scale: .45, svgOrigin: '412 380', opacity: 0 },
      { opacity: 1, duration: .15 }, .08)
    .to(orb, {
      motionPath: {
        path: [{ x: -260, y: -80 }, { x: -340, y: 0 }, { x: -270, y: 120 },
          { x: -100, y: 150 }, { x: 35, y: 55 }, { x: 0, y: 0 }],
        curviness: 1.2,
      },
      scale: 1, duration: 1.06, ease: 'power1.inOut',
    }, .08)
    .fromTo(tracks, { opacity: 0, scale: .85 }, { opacity: .65, scale: 1, duration: .25 }, .12)
    .to(tracks, { opacity: 0, duration: .3 }, .8)
    .fromTo(name, { y: 18, opacity: .2 }, { y: 0, opacity: 1, duration: .3 }, .84)
    .to({}, { duration: .3 });
}

setupMenu();
setupSketches();
setupWritingArchive();
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
setupIntroduction();
setupFinale();
setupMotion();
setupScrollbarSurface();

document.querySelectorAll<HTMLButtonElement>('[data-back-to-top]').forEach(button => {
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
    document.querySelector<HTMLAnchorElement>('.wordmark')?.focus({ preventScroll: true });
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-copy-email]').forEach(button => {
  button.addEventListener('click', async () => {
    const status = document.querySelector<HTMLElement>('[data-copy-status]');
    if (!status) return;
    try {
      await navigator.clipboard.writeText(button.dataset.copyEmail ?? '');
      status.textContent = 'Address copied.';
    } catch {
      status.textContent = 'Please select the email address to copy it.';
    }
  });
});
