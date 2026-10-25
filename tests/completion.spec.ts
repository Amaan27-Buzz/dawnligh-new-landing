import { test, expect } from '@playwright/test';

const projectSlugs = ['oscar','takokit','kinetable','aish'];

test('the branded scrollbar preserves native scroll and visibly tracks progress', async ({ page }) => {
  await page.goto('/research');
  const scrollProperties = await page.evaluate(() => ({
    width: getComputedStyle(document.documentElement).scrollbarWidth,
    color: getComputedStyle(document.documentElement).scrollbarColor,
    overflow: getComputedStyle(document.documentElement).overflowY,
  }));
  expect(scrollProperties.width).toBe('thin');
  expect(scrollProperties.color).not.toBe('auto');
  await expect(page.locator('.scroll-progress')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.scroll-rail')).toHaveAttribute('aria-hidden', 'true');
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior:'instant' }));
  await expect.poll(async () => page.evaluate(() =>
    Number.parseFloat(document.documentElement.style.getPropertyValue('--scroll-progress')))).toBeGreaterThan(.90);
  const current = await page.evaluate(() => window.scrollY);
  expect(current).toBeGreaterThan(0);
  await page.getByRole('button', { name: /Back to top/i }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(25);
});

test('four project pages have distinct interactive concept sequences and honest availability', async ({ page }) => {
  for (const slug of projectSlugs) {
    await page.goto('/projects/'+slug);
    const experience = page.locator('[data-project-experience]');
    await expect(experience).toHaveAttribute('data-project-experience',slug);
    const buttons = experience.locator('[data-experience-step]');
    await expect(buttons).toHaveCount(3);
    await buttons.nth(2).click();
    await expect(experience).toHaveAttribute('data-experience-phase','2');
    await expect(buttons.nth(2)).toHaveAttribute('aria-pressed','true');
    await expect(buttons.nth(0)).toHaveAttribute('aria-pressed','false');
    await expect(experience.locator('[data-experience-counter]')).toHaveText('3');
    await expect(experience.locator('[data-experience-tag]')).not.toBeEmpty();
    await expect(page.locator('.project-forward__destinations')).toContainText(slug+'.dawnlightlabs.com');
    await expect(page.locator('.project-forward__destinations a')).toHaveCount(0);
    await expect(page.getByText('NOT A LIVE PRODUCT DEMO')).toBeVisible();
  }
});

test('site works without unnecessary form or founder disclosures outside About', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('form')).toHaveCount(0);
  const email = page.locator('.contact-refined__email');
  await expect(email).toHaveAttribute('href','mailto:contact@dawnlightlabs.com');
  await page.getByRole('button', { name: /Copy address/i }).click();
  await expect(page.locator('[data-copy-status]')).not.toBeEmpty();
  await page.goto('/');
  await expect(page.getByText('Amaan Syed')).toHaveCount(0);
  await expect(page.getByText('Sairaj Jawalikar')).toHaveCount(0);
  await page.goto('/about');
  await expect(page.getByRole('heading', {name:'Amaan Syed'})).toBeVisible();
  await expect(page.getByRole('heading', {name:'Sairaj Jawalikar'})).toBeVisible();
  for (const card of await page.locator('.founder').all()) {
    await expect(card).toHaveCSS('opacity','1');
  }
});

test('sitemap is public and includes all approved routes, while publications remain unlisted', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBeTruthy();
  const xml = await response.text();
  for (const slug of projectSlugs) expect(xml).toContain('/projects/'+slug);
  expect(xml).toContain('/contact');
  expect(xml).not.toContain('/notes');
  expect(xml).not.toContain('/404');
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain('/sitemap.xml');
});

test('project, Contact, and About pages fit small screens without overflow', async ({ page }) => {
  for (const width of [360,390,768,1024,1440,1920]) {
    await page.setViewportSize({width,height:900});
    for (const path of ['/projects/oscar','/projects/takokit','/projects/kinetable','/projects/aish','/about','/contact']) {
      await page.goto(path);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(over, 'horizontal overflow at '+path+' / '+width).toBeLessThanOrEqual(2);
      await expect(page.locator('main h1').first()).toBeVisible();
    }
  }
});

test('reduced motion keeps project concepts selectable without animations', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/projects/kinetable');
  const experience = page.locator('[data-project-experience]');
  await experience.locator('[data-experience-step="1"]').click();
  await expect(experience).toHaveAttribute('data-experience-phase','1');
  await expect(experience.locator('[data-experience-tag]')).toHaveText('CONNECTION MAP');
});

test('capture finished project, About and Contact pages for design review', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  for (const slug of projectSlugs) {
    await page.goto('/projects/'+slug);
    await page.locator('[data-project-experience]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.locator('[data-project-experience]').screenshot({path:'test-results/motion-capture/detail-'+slug+'.png'});
    await page.locator('.project-hero').screenshot({path:'test-results/motion-capture/hero-'+slug+'.png'});
  }
  await page.goto('/about');
  await page.screenshot({path:'test-results/motion-capture/about-desktop.png'});
  await page.locator('.about-refined__founders').screenshot({path:'test-results/motion-capture/about-founders.png'});
  await page.goto('/contact');
  await page.screenshot({path:'test-results/motion-capture/contact-desktop.png'});
  await page.setViewportSize({width:390,height:844});
  await page.goto('/projects/kinetable');
  await page.screenshot({path:'test-results/motion-capture/project-mobile.png'});
  await page.goto('/contact');
  await page.screenshot({path:'test-results/motion-capture/contact-mobile.png'});
});


test('Research hero is balanced and includes a real visual on desktop and mobile', async ({ page }) => {
  for(const width of [390,768,1440]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/research');
    const visual=page.locator('[data-research-lens]');
    const title=page.locator('#research-title');
    await expect(visual).toBeVisible();
    await expect(title).toBeVisible();
    await expect(visual.locator('svg .lens-nodes>g')).toHaveCount(6);
    const hero=page.locator('.research-hero');
    const box=await hero.boundingBox();
    const diagram=await visual.boundingBox();
    expect(box && diagram).toBeTruthy();
    expect(diagram!.width).toBeGreaterThan(width<760?200:width<1100?275:350);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    expect(overflow).toBeLessThanOrEqual(2);
    if(width>1000){
      const heading=await title.boundingBox();
      expect((heading!.x + heading!.width)).toBeLessThan(diagram!.x+diagram!.width*.35);
    }
  }
});

test('home finale starts blue orb behind sun, transitions forward, and resolves to master logo', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  await expect(page.locator('[data-intro]')).toHaveCount(0,{timeout:8000});
  const back=page.locator('.closing__traveler--behind');
  const front=page.locator('.closing__traveler:not(.closing__traveler--behind)');
  const sun=page.locator('.closing__sun-disc');
  const final=page.locator('.closing__final');
  expect(await back.evaluate(el=>getComputedStyle(el).zIndex)).toBe('1');
  expect(await sun.evaluate(el=>getComputedStyle(el).zIndex)).toBe('2');
  expect(await front.evaluate(el=>getComputedStyle(el).zIndex)).toBe('3');
  const start=await page.locator('[data-closing]').evaluate(el=>el.getBoundingClientRect().top+scrollY);
  await page.evaluate(y=>scrollTo({top:y+innerHeight*.39,behavior:'instant'}),start);
  await expect.poll(()=>back.evaluate(el=>Number.parseFloat(getComputedStyle(el).opacity)),{timeout:5000}).toBeGreaterThan(.25);
  expect(await front.evaluate(el=>Number.parseFloat(getComputedStyle(el).opacity))).toBeLessThan(.2);
  // Sample the full passage through the upper-right edge. GSAP's scrub
  // intentionally eases toward the scroll position, so there is no single
  // instantaneous scroll coordinate that represents the whole crossover.
  const frontSamples: Array<{position:number,front:number,back:number,final:number}> = [];
  for (const position of [.82,.91,1.0,1.09,1.18,1.27]) {
    await page.evaluate(([y,f])=>scrollTo({top:y+innerHeight*f,behavior:'instant'}),[start,position]);
    await page.waitForTimeout(440);
    frontSamples.push({
      position,
      front: await front.evaluate(el=>Number.parseFloat(getComputedStyle(el).opacity)),
      back: await back.evaluate(el=>Number.parseFloat(getComputedStyle(el).opacity)),
      final: await final.evaluate(el=>Number.parseFloat(getComputedStyle(el).opacity)),
    });
  }
  console.log('Orb crossover samples:',JSON.stringify(frontSamples));
  expect(Math.max(...frontSamples.map(s=>s.front)),'front orb must emerge during the orbit').toBeGreaterThan(.5);
  await page.evaluate(y=>scrollTo({top:y+innerHeight*1.5,behavior:'instant'}),start);
  await expect.poll(()=>final.evaluate(el=>Number.parseFloat(getComputedStyle(el).opacity)),{timeout:5000}).toBeGreaterThan(.95);
  await expect(final).toHaveAttribute('src',/dawnlight%20with%20sun%20svg.svg/);
});
