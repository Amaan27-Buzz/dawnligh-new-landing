import {test,expect} from '@playwright/test';

test('home chapters use space and native settling without trapping project content',async({page})=>{
  await page.setViewportSize({width:1280,height:900});
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-intro-complete','true');
  await expect(page.locator('html')).toHaveCSS('scroll-snap-type',/^y(?: proximity)?$/);
  for(const selector of ['.home-work-heading','.project-highlight','.research-preview-list>a']){
    await expect(page.locator(selector).first()).toHaveCSS('border-top-width','0px');
    await expect(page.locator(selector).first()).toHaveCSS('border-bottom-width','0px');
  }
  const chapter=page.locator('.research-invitation');
  await chapter.evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-170,behavior:'instant'}));
  await page.mouse.move(600,450);await page.mouse.wheel(0,35);
  const landingOffset=await page.locator('html').evaluate(el=>parseFloat(getComputedStyle(el).scrollPaddingTop));
  await expect.poll(async()=>Math.abs((await chapter.boundingBox())!.y-landingOffset)).toBeLessThan(3);
  await page.waitForTimeout(700);
  await page.screenshot({path:'output/home-chapter-research-desktop.png'});
  await page.locator('.project-highlight--kinetable').scrollIntoViewIfNeeded();
  await expect(page.locator('.project-highlight--kinetable .project-name')).toBeInViewport();
  await page.locator('.home-belief').scrollIntoViewIfNeeded();
  await expect(page.locator('#home-belief')).toBeInViewport();
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('html')).toHaveCSS('scroll-snap-type','none');
  await expect(chapter.locator(':scope>div').first()).toHaveCSS('transform','none');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:390,height:844});
  await expect(page.locator('html')).toHaveCSS('scroll-snap-type','none');
  await chapter.scrollIntoViewIfNeeded();await page.waitForTimeout(700);
  await page.screenshot({path:'output/home-chapter-research-mobile.png'});
  await page.goto('/about');await expect(page.locator('html')).toHaveCSS('scroll-snap-type','none');
});

test('home is a concise route into research, projects and clearly draft publications',async({page,request})=>{
  await page.goto('/');
  await expect(page.locator('.project-highlight')).toHaveCount(4);
  await expect(page.locator('[data-sketch]')).toHaveCount(0);
  await expect(page.locator('.research-preview-list>a')).toHaveCount(6);
  await expect(page.locator('.site-footer a[href="/notes"]')).toHaveCount(1);
  for(const link of await page.locator('.research-preview-list>a').evaluateAll(els=>els.map(el=>el.getAttribute('href')!))){
    await page.goto(link);await expect(page.locator('#'+link.split('#')[1])).toBeVisible();
  }
  await page.goto('/site-map');
  for(const href of await page.locator('.page-map a').evaluateAll(els=>els.map(el=>el.getAttribute('href')!))){expect((await request.get(href)).ok(),href).toBeTruthy();}
  for(const route of ['/notes','/notes/local-voice-runtime','/notes/efficient-intelligence','/notes/understanding-circuits','/research/programs','/site-map']){
    await page.goto(route);await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex, follow');
    await expect(page.locator('main h1')).toHaveCount(1);
  }
});

test('inset hero keeps the complete orb, follows scroll and has no motion buttons',async({page})=>{
  for(const [width,height] of [[1280,720],[1440,900],[390,844]]){
    await page.setViewportSize({width,height});await page.goto('/');await page.waitForTimeout(3400);
    const stage=page.locator('.daybreak');const orb=stage.locator('img');
    const box=await orb.boundingBox();const bounds=await stage.boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(bounds!.y);expect(box!.y+box!.height).toBeLessThanOrEqual(bounds!.y+bounds!.height);
    expect(box!.x).toBeGreaterThan(bounds!.x);expect(box!.x+box!.width).toBeLessThan(bounds!.x+bounds!.width);
    await expect(page.locator('[data-motion-pause]')).toHaveCount(0);
    const initial=await orb.evaluate(el=>getComputedStyle(el).transform);
    await page.evaluate(()=>scrollTo({top:500,behavior:'instant'}));await page.waitForTimeout(900);
    expect(await orb.evaluate(el=>getComputedStyle(el).transform)).not.toBe(initial);
  }
  await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.daybreak img')).toHaveCSS('transform','none');
  await page.goto('/projects');await expect(page.locator('[data-motion-pause]')).toHaveCount(0);
});

test('approved About light field retains its blue and sky layers and scroll motion',async({page})=>{
  await page.goto('/about');
  const field=page.locator('.about-opening>.light-field');
  await expect(field.locator('path')).toHaveCount(3);
  await expect(field.locator('.light-field__blue')).toHaveCSS('fill','rgb(14, 68, 144)');
  await expect(field.locator('.light-field__sky')).toHaveCSS('fill','rgb(168, 218, 249)');
  const layer=field.locator('.light-field__blue');const before=await layer.getAttribute('transform');
  await page.evaluate(()=>scrollBy({top:300,behavior:'instant'}));await page.waitForTimeout(900);
  expect(await layer.getAttribute('transform')).not.toBe(before);
});
