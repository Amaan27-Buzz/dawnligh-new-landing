import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function setupMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;
  const close = () => {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  };
  toggle.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) close(); }, { passive: true });
}
function setupScenePausing() {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.project-card'));
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-paused', !entry.isIntersecting));
  }, { threshold: .01 });
  cards.forEach((card) => observer.observe(card));
  document.addEventListener('visibilitychange', () => document.body.classList.toggle('is-paused', document.hidden));
}
function setupMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  const hero = document.querySelector<HTMLElement>('[data-hero-orb]');
  const heroBody = hero?.querySelector<HTMLElement>('.hero-orb__body');
  const firstVisit = (() => {
    try {
      if (sessionStorage.getItem('dawnlight-intro-played') === 'true') return false;
      sessionStorage.setItem('dawnlight-intro-played', 'true');
      return true;
    } catch { return true; }
  })();
  if (hero && heroBody) {
    if (firstVisit) {
      gsap.set(hero, { '--sweep': '0deg' });
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro.fromTo(heroBody, { scale: .84, rotate: -28, opacity: .5 },
        { scale: 1, rotate: 0, opacity: 1, duration: 1.28 }, 0);
      intro.to(hero, { '--sweep': '360deg', duration: 1.55, ease: 'power2.inOut' }, .08);
      intro.from('.hero-content .eyebrow', { y: 14, opacity: 0, duration: .6 }, .34);
      intro.from('.hero-content h1', { y: 26, opacity: 0, duration: .82 }, .55);
      intro.from('.hero-lead, .hero-content .text-link', { y: 14, opacity: 0, duration: .65, stagger: .12 }, .83);
    } else gsap.set(hero, { '--sweep': '360deg' });
    gsap.to(heroBody, {
      rotate: 42, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 }
    });
    const visual = document.querySelector<HTMLElement>('.hero-visual');
    visual?.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const bounds = visual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      gsap.to(heroBody, { x: x * 13, y: y * 13, duration: .75, overwrite: 'auto', ease: 'power2.out' });
      document.documentElement.style.setProperty('--light-angle', String(135 + x * 32) + 'deg');
    }, { passive: true });
    visual?.addEventListener('pointerleave', () => gsap.to(heroBody, { x: 0, y: 0, duration: .8, overwrite: 'auto' }));
  }
  gsap.utils.toArray<HTMLElement>('.js-reveal').forEach((element) => {
    gsap.from(element, {
      y: 23, opacity: 0, duration: .8, ease: 'power2.out',
      scrollTrigger: { trigger: element, start: 'top 92%', once: true }
    });
  });
  const closing = document.querySelector<HTMLElement>('[data-closing]');
  if (closing) {
    const final = closing.querySelector<HTMLElement>('.closing__final');
    const sunlight = closing.querySelector<HTMLElement>('.closing__sunlight');
    const traveler = closing.querySelector<HTMLElement>('.closing__orbit');
    if (final && sunlight && traveler) {
      gsap.set(final, { opacity: 0 });
      gsap.set(traveler, { opacity: 1 });
      gsap.set(sunlight, { opacity: 0, scale: .7 });
      const settle = gsap.timeline({
        scrollTrigger: { trigger: closing, start: 'top 86%', end: 'center 40%', scrub: 1, invalidateOnRefresh: true }
      });
      settle.to(sunlight, { opacity: 1, scale: 1, duration: .35 }, 0);
      settle.fromTo(traveler, { rotate: -165 }, { rotate: 315, duration: 1, ease: 'none' }, 0);
      settle.to(final, { opacity: 1, duration: .13 }, .83);
      settle.to(traveler, { opacity: 0, duration: .10 }, .88);
      settle.to(sunlight, { opacity: 0, duration: .10 }, .88);
      settle.from('.closing__name', { opacity: 0, y: 18, duration: .24 }, .79);
    }
  }
}
setupMenu();
setupScenePausing();
setupMotion();
