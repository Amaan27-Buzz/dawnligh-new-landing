import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function setupMotion(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => {
    header?.style.setProperty('--reading-progress', String(self.progress));
    header?.classList.toggle('is-scrolled', self.scroll() > 24);
  } });

  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const entrance = () => {
      if (scrollY > 100) return;
      gsap.fromTo('main h1', { y: 28, clipPath: 'inset(0 0 12% 0)' }, {
        y: 0, clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'power3.out', clearProps: 'transform,clipPath',
      });
      gsap.fromTo('.opening-bottom,.project-opening__summary,.contact-body', { y: 18, opacity: .7 }, {
        y: 0, opacity: 1, duration: .7, delay: .12, ease: 'power3.out', clearProps: 'transform,opacity',
      });
    };
    if (document.querySelector('[data-intro]')) document.addEventListener('dawnlight:intro-complete', entrance, { once: true });
    else entrance();

    // The light opens the illustrations; reading copy stays at full contrast.
    document.querySelectorAll<HTMLElement>('.sketch').forEach(sketch => {
      gsap.fromTo(sketch, { clipPath: 'inset(0 5% 0 0 round 0 110px 0 0)' }, {
        clipPath: 'inset(0 0% 0 0 round 0 90px 0 0)', duration: 1, ease: 'power3.out', clearProps: 'clipPath',
        scrollTrigger: { trigger: sketch, start: 'top 94%', once: true },
      });
    });
    document.querySelectorAll<HTMLElement>('.project-feature__copy,.section-heading,.founder,.project-question,.people-intro').forEach(element => {
      gsap.fromTo(element, { y: 30 }, { y: 0, duration: .8, ease: 'power3.out', clearProps: 'transform',
        scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
    });
    document.querySelectorAll<HTMLElement>('.inquiry').forEach(element => {
      gsap.fromTo(element, { '--inquiry-progress': 0 }, { '--inquiry-progress': 1, ease: 'none',
        scrollTrigger: { trigger: element, start: 'top 85%', end: 'bottom 45%', scrub: .5 } });
    });
    const daybreak = document.querySelector('.daybreak');
    if (daybreak) {
      gsap.fromTo('.daybreak img', { y: 10 }, { y: -10, ease: 'none',
        scrollTrigger: { trigger: daybreak, start: 'top bottom', end: 'bottom top', scrub: .8 } });
      gsap.fromTo('.daybreak-light', { clipPath: 'ellipse(90% 140% at 110% -20%)' }, {
        clipPath: 'ellipse(85% 170% at 90% 10%)', ease: 'none',
        scrollTrigger: { trigger: daybreak, start: 'top bottom', end: 'bottom top', scrub: .8 } });
      gsap.fromTo('.daybreak-contour', { xPercent: -3 }, { xPercent: 3, ease: 'none',
        scrollTrigger: { trigger: daybreak, start: 'top bottom', end: 'bottom top', scrub: .8 } });
    }
    document.querySelectorAll('[data-home-chapter]').forEach(chapter => {
      const content = chapter.matches('.work-section')
        ? chapter.querySelectorAll('.home-work-heading>div,.home-work-heading>p')
        : chapter.children;
      gsap.fromTo(content, { y: 44 }, { y: 0, stagger: .12, ease: 'power2.out',
        scrollTrigger: { trigger: chapter, start: 'top 92%', end: 'top 45%', scrub: .45 } });
    });
    const researchPanel = document.querySelector('.research-invitation .research-topics');
    if (researchPanel) {
      gsap.fromTo(researchPanel, { borderTopRightRadius: Math.min(220, researchPanel.clientWidth * .4) }, { borderTopRightRadius: 100, ease: 'none',
        scrollTrigger: { trigger: researchPanel, start: 'top 95%', end: 'top 40%', scrub: .5 } });
    }
    document.querySelectorAll('.project-highlight,.note-preview-list>a,.lab-introduction').forEach(element => {
      gsap.fromTo(element, { y: 36 }, { y: 0, duration: .9, ease: 'power3.out', clearProps: 'transform',
        scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
    });
    document.querySelectorAll('.project-highlight__art').forEach(element => {
      gsap.fromTo(element, { clipPath: 'inset(0 0 0 12%)' }, { clipPath: 'inset(0 0 0 0%)', ease: 'none',
        scrollTrigger: { trigger: element, start: 'top 95%', end: 'top 55%', scrub: .4 } });
    });
    document.querySelectorAll('.light-field').forEach(field => {
      const scrollTrigger = { trigger: field, start: 'top bottom', end: 'bottom 20%', scrub: .7 };
      gsap.fromTo(field.querySelector('.light-field__blue'), { xPercent: 16, y: 55 }, { xPercent: 0, y: 0, ease: 'none', scrollTrigger });
      gsap.fromTo(field.querySelector('.light-field__sky'), { xPercent: 25, y: 35 }, { xPercent: -3, y: 0, ease: 'none', scrollTrigger });
      gsap.fromTo(field.querySelector('.light-field__paper'), { xPercent: 10 }, { xPercent: -5, ease: 'none', scrollTrigger });
    });
    document.querySelectorAll('.research-practice,.about-thinking,.project-approach').forEach(field => {
      gsap.fromTo(field, { borderTopRightRadius: 200 }, { borderTopRightRadius: 70, ease: 'none',
        scrollTrigger: { trigger: field, start: 'top bottom', end: 'top 20%', scrub: .6 } });
    });
    document.querySelectorAll<HTMLElement>('.shell-proposal').forEach(element => {
      gsap.fromTo(element, { '--command-progress': 0 }, { '--command-progress': 1, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: element, start: 'top 90%', once: true } });
    });

    // Worker motion follows scroll; Takokit's continuous signals are owned by sketches.ts.
    document.querySelectorAll<HTMLElement>('[data-sketch="oscar"]').forEach(sketch => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: sketch, start: 'top 90%', end: 'bottom 20%', scrub: .45 } });
      const paths = sketch.querySelectorAll<SVGPathElement>('.voice-path,.worker-route');
      sketch.querySelectorAll<SVGCircleElement>('.voice-packet,.worker-packet').forEach((packet, index) => {
        const path = paths[index];
        if (!path) return;
        timeline.set(packet, { opacity: 1 }, index * .35)
          .to(packet, { motionPath: { path, align: path, alignOrigin: [.5, .5] }, duration: 3.1, ease: 'none' }, index * .35)
          .to(packet, { opacity: 0, duration: .2 }, index * .35 + 2.9);
      });
      const voice = sketch.querySelector('.voice-runtime img');
      if (voice) timeline.fromTo(voice, { y: 4 }, { y: -4, duration: 4.2, ease: 'none' }, 0);
    });
    return () => document.removeEventListener('dawnlight:intro-complete', entrance);
  });
  void document.fonts.ready.then(() => ScrollTrigger.refresh());
}
