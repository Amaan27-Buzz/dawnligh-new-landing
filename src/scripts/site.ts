import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupMenu(): void {
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
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) close(); }, { passive: true });
}

function setupScenePausing(): void {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.project-card'));
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-paused', !entry.isIntersecting));
  }, { threshold: .01 });
  cards.forEach(card => observer.observe(card));
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('is-paused', document.hidden);
  });
}

function setupIntroduction(): void {
  const intro = document.querySelector<HTMLElement>('[data-intro]');
  if (!intro) return;
  if (reducedMotion) { intro.remove(); return; }

  const mark = intro.querySelector<HTMLElement>('[data-intro-mark]');
  const words = intro.querySelector<HTMLElement>('[data-intro-words]');
  const arc = intro.querySelector<HTMLElement>('.intro-sequence__arc');
  const lit = intro.querySelector<HTMLElement>('.intro-sequence__lit');
  if (!mark || !words || !arc || !lit) { intro.remove(); return; }

  // No session gate: a fresh homepage load always shows the requested opening.
  // Native SVG is progressively revealed by a real, rotating angular mask.
  const reveal = { angle: 0 };
  mark.style.setProperty('--sweep', '0deg');
  const tl = gsap.timeline({
    onComplete: () => { intro.remove(); document.documentElement.dataset.introComplete = 'true'; },
  });
  tl.fromTo(mark,
    { opacity: 0, scale: .74, rotation: -32 },
    { opacity: 1, scale: 1, rotation: 0, duration: .82, ease: 'power3.out' }, 0)
    .to(arc, { opacity: 1, rotation: 310, duration: 1.30, ease: 'power2.inOut' }, .15)
    .to(reveal, {
      angle: 360, duration: 1.35, ease: 'power2.inOut',
      onUpdate: () => mark.style.setProperty('--sweep', reveal.angle.toFixed(2) + 'deg'),
    }, .22)
    .to(arc, { opacity: 0, duration: .32 }, 1.24)
    .fromTo('.intro-sequence__glint', { opacity: 0, scale: .6 },
      { opacity: .9, scale: 1.55, duration: .38, yoyo: true, repeat: 1 }, 1.05)
    .to(words, { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: .85, ease: 'power3.inOut' }, .79)
    .fromTo('.intro-sequence__rule', { scaleX: 0 },
      { scaleX: 1, duration: .66, ease: 'power2.out' }, 1.13)
    .to('.intro-sequence__bottom', { opacity: .75, duration: .5 }, 1.24)
    .to(intro, { clipPath: 'inset(0 0 100% 0)', duration: .82, ease: 'power3.inOut' }, 2.12);
}

function setupHero(): void {
  if (reducedMotion) return;
  const hero = document.querySelector<HTMLElement>('[data-hero-orb]');
  const body = hero?.querySelector<HTMLElement>('.hero-orb__body');
  if (!hero || !body) return;
  // The hero is fully assembled on the actual page; opening belongs to the brand film.
  gsap.set(hero, { '--sweep': '360deg' });
  gsap.fromTo(body, { y: 35, scale: .93 }, { y: 0, scale: 1, duration: 1.6, ease: 'power2.out', delay: 1.95 });
  gsap.to(body, { rotation: 27, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .85 } });

  const visual = document.querySelector<HTMLElement>('.hero-visual');
  visual?.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    gsap.to(body, { x: x * 23, y: y * 21, duration: .65, overwrite: 'auto', ease: 'power2.out' });
  }, { passive: true });
  visual?.addEventListener('pointerleave', () => gsap.to(body, { x: 0, y: 0, duration: .75 }));
}

function setupContentMotion(): void {
  if (reducedMotion) return;
  gsap.utils.toArray<HTMLElement>('.js-reveal').forEach(element => {
    gsap.from(element, {
      y: 34, autoAlpha: 0, duration: 1.03, ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 94%', once: true },
    });
  });
  document.querySelectorAll<HTMLElement>('.project-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((event.clientX - bounds.left) / bounds.width * 100).toFixed(2) + '%');
      card.style.setProperty('--my', ((event.clientY - bounds.top) / bounds.height * 100).toFixed(2) + '%');
    }, { passive: true });
  });
}

function setupFinale(): void {
  const closing = document.querySelector<HTMLElement>('[data-closing]');
  if (!closing || reducedMotion) return;
  const frame = closing.querySelector<HTMLElement>('.closing__frame');
  const stage = closing.querySelector<HTMLElement>('.closing__stage');
  const sun = closing.querySelector<HTMLElement>('.closing__sun-disc');
  const traveler = closing.querySelector<HTMLElement>('.closing__traveler');
  const composite = closing.querySelector<HTMLElement>('.closing__final');
  const orbitTrack = closing.querySelector<HTMLElement>('.closing__orbit-track');
  const dawn = closing.querySelector<HTMLElement>('.closing__dawn');
  const name = closing.querySelector<HTMLElement>('.closing__name');
  if (!frame || !stage || !sun || !traveler || !composite || !orbitTrack || !dawn || !name) return;

  const w = () => stage.getBoundingClientRect().width || 520;
  gsap.set(composite, { opacity: 0 });
  gsap.set(sun, { opacity: 0, scale: .6, y: 55 });
  gsap.set(traveler, { opacity: 0, scale: .62, x: -w() * .46, y: -w() * .51 });
  gsap.set(orbitTrack, { opacity: 0, scale: .74 });
  gsap.set(dawn, { opacity: 0 });
  gsap.set(name, { opacity: 0, y: 44 });

  // Each position is relative to the exact destination in the
  // original combined 582px SVG: orb x=267.923, y=236.396, w=290.
  // On the final frame we swap to that unmodified combined SVG.
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: closing, start: 'top top',
      end: () => '+=' + Math.max(760, Math.round(window.innerHeight * 1.30)),
      pin: frame, pinSpacing: true, anticipatePin: 1,
      scrub: .65, invalidateOnRefresh: true,
    },
    defaults: { ease: 'sine.inOut' },
  });
  tl.to(dawn, { opacity: .95, duration: .28 }, 0)
    .to(sun, { opacity: 1, scale: 1, y: 0, duration: .29 }, .03)
    .to(orbitTrack, { opacity: .8, scale: 1, duration: .20 }, .12)
    .to(orbitTrack, { rotation: 160, duration: .7, ease: 'none' }, .19)
    .to(traveler, { opacity: 1, duration: .14 }, .19)
    .to(traveler, { x: () => -w() * .15, y: () => -w() * .55, scale: .75, rotation: -13, duration: .22 }, .21)
    .to(traveler, { x: () => w() * .18, y: () => -w() * .31, scale: .84, rotation: 19, duration: .22 }, .43)
    .to(traveler, { x: () => w() * .20, y: () => -w() * .015, scale: .96, rotation: 13, duration: .16 }, .65)
    .to(traveler, { x: 0, y: 0, scale: 1, rotation: 0, duration: .14 }, .81)
    .to(name, { opacity: 1, y: 0, duration: .26 }, .74)
    .to(composite, { opacity: 1, duration: .10 }, .91)
    .to([sun, traveler, orbitTrack], { opacity: 0, duration: .10 }, .91)
    // Hold the exact completed artwork long enough to actually see it.
    .to({}, { duration: .45 }, 1.03);
  const inFinale = () => document.documentElement.classList.add('finale-active');
  const outFinale = () => document.documentElement.classList.remove('finale-active');
  ScrollTrigger.create({
    trigger: closing,
    start: 'top top',
    end: 'bottom top',
    onEnter: inFinale,
    onEnterBack: inFinale,
    onLeave: outFinale,
    onLeaveBack: outFinale,
  });
}

setupMenu();
setupScenePausing();
if (!reducedMotion) gsap.registerPlugin(ScrollTrigger);
setupIntroduction();
setupHero();
setupContentMotion();
setupFinale();
