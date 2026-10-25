import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupResearchAtlases } from './research-atlas';
import { setupSiteInteractions } from './experience-interactions';
import { setupEditorialMotion } from './editorial-motion';

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
  document.querySelectorAll<HTMLElement>('.research-atlas').forEach(atlas => {
    const visual = atlas.querySelector<HTMLElement>('.research-atlas__visual');
    if (visual) gsap.from(visual, { scale: .94, y: 28, duration: 1.18, ease: 'power2.out', scrollTrigger: { trigger: atlas, start: 'top 92%', once: true } });
  });
  document.querySelectorAll<HTMLElement>('.project-card').forEach(card => {
    const artwork = card.querySelector<HTMLElement>('.project-card__art');
    const scene = card.querySelector<HTMLElement>('.art');
    if (artwork) {
      // Artwork continuously settles into place as the card crosses the viewport.
      // Content, labels and click targets remain completely stationary.
      gsap.fromTo(artwork,
        { scale: 1.14 },
        { scale: 1, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: .85 } }
      );
    }
    card.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      card.style.setProperty('--mx', ((x+.5)*100).toFixed(2) + '%');
      card.style.setProperty('--my', ((y+.5)*100).toFixed(2) + '%');
      if (scene) gsap.to(scene, { x: x * 13, y: y * 13, duration: .75, ease:'power2.out', overwrite: 'auto' });
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      if (scene) gsap.to(scene, { x: 0, y: 0, duration: .9, ease: 'power2.out', overwrite: 'auto' });
    });
  });
}

function setupFinale(): void {
  const closing = document.querySelector<HTMLElement>('[data-closing]');
  if (!closing || reducedMotion) return;
  const frame = closing.querySelector<HTMLElement>('.closing__frame');
  const stage = closing.querySelector<HTMLElement>('.closing__stage');
  const sun = closing.querySelector<HTMLElement>('.closing__sun-disc');
  const behind = closing.querySelector<HTMLElement>('.closing__traveler--behind');
  const traveler = closing.querySelector<HTMLElement>('.closing__traveler:not(.closing__traveler--behind)');
  const composite = closing.querySelector<HTMLElement>('.closing__final');
  const orbitTrack = closing.querySelector<HTMLElement>('.closing__orbit-track');
  const dawn = closing.querySelector<HTMLElement>('.closing__dawn');
  const name = closing.querySelector<HTMLElement>('.closing__name');
  if (!frame || !stage || !sun || !behind || !traveler || !composite || !orbitTrack || !dawn || !name) return;

  // Both traveling images have the same dimensions and destination as the
  // orb within the original supplied 582px sun+orb SVG. The rear image
  // passes behind the standalone yellow sun; the second passes in front.
  const width = () => stage.getBoundingClientRect().width || 520;
  const pose = { x: -.209, y: -.115, scale: .66, rotation: -35 };
  const place = () => gsap.set([behind, traveler], {
    x: pose.x * width(), y: pose.y * width(),
    scale: pose.scale, rotation: pose.rotation,
  });
  gsap.set(composite, { opacity: 0 });
  gsap.set(sun, { opacity: 0, scale: .62, y: 55 });
  gsap.set(behind, { opacity: 0 });
  gsap.set(traveler, { opacity: 0 });
  gsap.set(orbitTrack, { opacity: 0, scale: .72 });
  gsap.set(dawn, { opacity: 0 });
  gsap.set(name, { opacity: 0, y: 38 });
  place();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: closing, start: 'top top',
      end: () => '+=' + Math.max(1080, Math.round(window.innerHeight * 1.8)),
      pin: frame, pinSpacing: true, anticipatePin: 1,
      scrub: .75, invalidateOnRefresh: true,
    },
    defaults: { ease: 'sine.inOut' },
  });
  tl.to(dawn, { opacity: .93, duration: .28 }, 0)
    .to(sun, { opacity: 1, scale: 1, y: 0, duration: .23 }, .02)
    .to(orbitTrack, { opacity: .54, scale: 1, duration: .22 }, .12)
    .to(orbitTrack, { rotation: 158, duration: .83, ease: 'none' }, .25)
    // The orb is inside the sun's silhouette, physically behind its layer.
    .to(behind, { opacity: 1, duration: .08 }, .26)
    // It emerges above the upper-left solar rim.
    .to(pose, { x: -.37, y: -.51, scale: .82, rotation: -45, duration: .24, onUpdate: place }, .28)
    .to(pose, { x: -.10, y: -.65, scale: .94, rotation: -14, duration: .25, onUpdate: place }, .52)
    // Cross from the rear layer to the foreground as it clears the top.
    .to(traveler, { opacity: 1, duration: .08 }, .73)
    .to(behind, { opacity: 0, duration: .08 }, .73)
    // Sweep right, then down to the precise master logo position.
    .to(pose, { x: .19, y: -.41, scale: .99, rotation: 22, duration: .30, onUpdate: place }, .77)
    .to(pose, { x: 0, y: 0, scale: 1, rotation: 0, duration: .28, onUpdate: place }, 1.07)
    .to(name, { opacity: 1, y: 0, duration: .28 }, 1.16)
    // The final frame is the unmodified original SVG, never a recreation.
    .to(composite, { opacity: 1, duration: .11 }, 1.38)
    .to([behind, traveler, sun, orbitTrack], { opacity: 0, duration: .11 }, 1.38)
    .to({}, { duration: .40 }, 1.53);

  const inFinale = () => document.documentElement.classList.add('finale-active');
  const outFinale = () => document.documentElement.classList.remove('finale-active');
  ScrollTrigger.create({
    trigger: closing, start: 'top top', end: 'bottom top',
    onEnter: inFinale, onEnterBack: inFinale,
    onLeave: outFinale, onLeaveBack: outFinale,
  });
  window.addEventListener('resize', place, { passive: true });
}

setupMenu();
setupScenePausing();
setupResearchAtlases();
setupSiteInteractions();
if (!reducedMotion) gsap.registerPlugin(ScrollTrigger);
setupIntroduction();
setupHero();
setupContentMotion();
setupEditorialMotion();
setupFinale();
