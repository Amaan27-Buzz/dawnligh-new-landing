import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Every scroll effect respects native scrolling; no virtual wheel, Lenis,
// scroll snapping, fixed viewport hijacking or permanent hidden content.
export function setupEditorialMotion(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  const researchHero = document.querySelector<HTMLElement>('.research-hero');
  if (researchHero) {
    const headline = researchHero.querySelectorAll<HTMLElement>('.research-hero__copy h1 span');
    gsap.from(headline, { y: 37, opacity: 0, stagger: .17, duration: 1.05, ease: 'power3.out', delay: .10 });
    gsap.from('.research-hero__copy>.eyebrow, .research-hero__copy>p, .research-hero__explore',
      { y: 16, opacity: 0, stagger: .11, duration: .72, ease: 'power2.out', delay: .30 });
    gsap.from('.research-hero__visual', { opacity: 0, y: 27, scale: .91, duration: 1.16, ease: 'power2.out', delay: .15 });

    const diagram = researchHero.querySelector<SVGElement>('.research-hero__diagram');
    const core = researchHero.querySelector<HTMLElement>('.research-hero__core');
    if (diagram) {
      gsap.to(diagram, {
        rotation: 53, scale: 1.1, y: -35, ease: 'none',
        scrollTrigger: { trigger: researchHero, start: 'top top', end: 'bottom top', scrub: 1.15 }
      });
    }
    if (core) {
      gsap.to(core, {
        rotation: -29, scale: .80, y: -41, ease: 'none',
        scrollTrigger: { trigger: researchHero, start: 'top top', end: 'bottom top', scrub: 1.1 }
      });
    }
    const visual = researchHero.querySelector<HTMLElement>('.research-hero__visual');
    visual?.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const r = visual.getBoundingClientRect();
      const x = (event.clientX-r.left)/r.width - .5;
      const y = (event.clientY-r.top)/r.height - .5;
      gsap.to(visual, { x:x*9, y:y*9, duration:.72, ease:'power2.out', overwrite:'auto' });
    }, { passive:true });
    visual?.addEventListener('pointerleave', () => gsap.to(visual, {x:0,y:0,duration:.8}));
  }

  // Progressively reveal the edges and rhythm of the six research domains.
  document.querySelectorAll<HTMLElement>('.research-culture-grid .culture-item').forEach((item, index) => {
    gsap.from(item, {
      opacity:0, y:45, duration:1.12, delay:index*.075, ease:'power3.out',
      scrollTrigger: { trigger:item, start:'top 93%', once:true }
    });
  });
  const culture = document.querySelector<HTMLElement>('.research-culture');
  if (culture) {
    gsap.to(culture, {
      backgroundColor:'#0b324d',ease:'none',
      scrollTrigger:{ trigger:culture,start:'top bottom',end:'bottom top',scrub:1.4 }
    });
  }
  document.querySelectorAll<HTMLElement>('.research-area').forEach((item,index) => {
    gsap.from(item, {
      opacity:0,y:24,duration:.8,delay:(index%2)*.10,
      scrollTrigger:{trigger:item,start:'top 92%',once:true}
    });
  });
  const atlas = document.querySelector<HTMLElement>('.research-atlas');
  if (atlas) {
    const svg = atlas.querySelector<SVGElement>('.research-atlas__svg');
    if (svg) gsap.to(svg,{
      y:-30,scale:1.045,ease:'none',
      scrollTrigger:{trigger:atlas,start:'top bottom',end:'bottom top',scrub:1.05}
    });
  }
  document.querySelectorAll<HTMLElement>('.section-intro:not(.js-reveal)').forEach(intro => {
    const heading = intro.querySelector('h2');
    if (heading) gsap.from(heading,{
      opacity:0,y:25,duration:.95,ease:'power2.out',
      scrollTrigger:{trigger:intro,start:'top 93%',once:true}
    });
  });
  document.querySelectorAll<HTMLElement>('.project-hero__visual').forEach(visual => {
    const art=visual.querySelector<HTMLElement>('.art');
    if (art) gsap.fromTo(art,{scale:1.1,y:30},{scale:1,y:-30,ease:'none',
      scrollTrigger:{trigger:visual.closest('.project-hero'),start:'top top',end:'bottom top',scrub:1.1}
    });
  });
  document.querySelectorAll<HTMLElement>('.project-premise h2, .project-philosophy h2, .projects-index-outro h2').forEach(node=>{
    gsap.from(node,{opacity:0,y:28,duration:1.1,ease:'power2.out',scrollTrigger:{trigger:node,start:'top 90%',once:true}});
  });
  const aboutSymbol = document.querySelector<HTMLElement>('.about-refined__symbol');
  if (aboutSymbol) {
    gsap.to(aboutSymbol,{rotation:22,scale:.89,ease:'none',scrollTrigger:{
      trigger:'.about-refined',start:'top top',end:'bottom top',scrub:1.1
    }});
  }
}
