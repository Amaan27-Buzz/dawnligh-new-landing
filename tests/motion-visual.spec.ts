import {test,expect} from '@playwright/test';
test('opening crescent sweeps into place and the wordmark appears',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  const intro=page.locator('[data-intro]');
  await expect(intro).toBeVisible();
  const lead=intro.locator('.swipe-lead');
  await expect(lead).toHaveAttribute('transform', /matrix/);
  const samples: (string|null)[]=[];
  for(let i=0;i<7;i++){
    samples.push(await lead.getAttribute('transform'));
    await page.waitForTimeout(100);
  }
  expect(new Set(samples).size).toBeGreaterThan(2);
  await expect(intro.locator('mask .swipe-trail')).toHaveCount(1);
  await expect.poll(()=>intro.locator('[data-intro-words]').evaluate(el=>Number(getComputedStyle(el).opacity))).toBeGreaterThan(.1);
  await expect(intro).toHaveCount(0,{timeout:8000});
});
test('final mark settles with only Dawnlight visible at the actual end of the page',async({page})=>{
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:844});
    await page.goto('/');
    await expect(page.locator('[data-intro]')).toHaveCount(0,{timeout:8000});
    const closing=page.locator('[data-closing]');
    const orb=page.locator('.closing__satellite');
    const samples:string[]=[];
    for(const progress of [.2,.55,1]){
      await closing.evaluate((el,p)=>{const start=el.getBoundingClientRect().top+scrollY-innerHeight;scrollTo({top:start+el.clientHeight*p,behavior:'instant'})},progress);
      await page.waitForTimeout(650);samples.push(await orb.getAttribute('transform')??'');
    }
    expect(new Set(samples).size).toBeGreaterThanOrEqual(2);
    await expect.poll(()=>orb.getAttribute('transform')).toBe('matrix(1,0,0,1,0,0)');
    await expect(page.locator('.closing__name')).toHaveCSS('opacity','1');
    expect(await closing.innerText()).toBe('DAWNLIGHT');
    expect(await page.evaluate(()=>Math.abs(scrollY+innerHeight-document.documentElement.scrollHeight))).toBeLessThan(3);
    await expect(page.locator('.site-header')).toBeHidden();
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
  }
});
test('capture the coherent desktop and mobile compositions',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  const directory='test-results/redesign';
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:900});
    for(const route of ['/','/research','/projects','/projects/oscar','/projects/takokit','/projects/kinetable','/projects/aish','/about','/contact']){
      await page.goto(route);
      await page.screenshot({path:directory+'/'+(route==='/'?'home':route.slice(1).replaceAll('/','-'))+'-'+width+'.png',fullPage:true});
    }
  }
});
