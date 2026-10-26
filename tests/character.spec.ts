import {test,expect} from '@playwright/test';

test('brand paper and scrollbar use the supplied palette',async({page})=>{
  await page.goto('/research');
  await expect(page.locator('body')).toHaveCSS('background-color','rgb(252, 248, 245)');
  await expect(page.getByRole('scrollbar')).toHaveCount(0);
  const track=await page.evaluate(()=>getComputedStyle(document.documentElement,'::-webkit-scrollbar-track').backgroundColor);
  expect(track).toBe('rgba(0, 0, 0, 0)');
  await expect(page.locator('html')).toHaveCSS('scrollbar-gutter','auto');

});

test('voice signals flow continuously without extra controls and pause off screen',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/projects/takokit');
  const sketch=page.locator('[data-sketch="takokit"]');
  await sketch.scrollIntoViewIfNeeded();
  const packet=sketch.locator('.voice-packet').first();
  await expect.poll(()=>packet.getAttribute('cx')).not.toBeNull();
  const initial=await packet.getAttribute('cx');
  await expect.poll(()=>packet.getAttribute('cx')).not.toBe(initial);
  await page.locator('.site-footer').scrollIntoViewIfNeeded();await page.waitForTimeout(200);
  const settled=await packet.getAttribute('cx');await page.waitForTimeout(300);
  expect(await packet.getAttribute('cx')).toBe(settled);
  await expect(page.locator('[data-motion-pause]')).toHaveCount(0);
  await sketch.getByRole('button',{name:'Speak',exact:true}).click();
  await expect(sketch.locator('.voice-output')).toHaveText('Speech out');
  const bounds=await sketch.locator('.voice-workflow').boundingBox();
  const controls=await sketch.locator('.voice-modes').boundingBox();
  expect(controls!.y+controls!.height).toBeLessThan(bounds!.y+bounds!.height);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(sketch.locator('[data-motion-pause]')).toHaveCount(0);
  await expect(sketch.locator('.voice-runtime img')).toHaveCSS('transform','none');
});

test('project spreads fit short and tall desktop windows',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const [width,height] of [[1280,720],[1536,792],[1440,900],[1920,1080]]){
    await page.setViewportSize({width,height});await page.goto('/projects');await page.evaluate(()=>document.fonts.ready);
    for(const kind of ['oscar','takokit','kinetable','aish']){
      const spread=page.locator('.project-feature--'+kind);
      const result=await spread.evaluate(el=>{
        const header=document.querySelector('.site-header')!.getBoundingClientRect().height;
        const box=el.getBoundingClientRect();return {height:box.height,available:innerHeight-header};
      });
      expect(result.height,kind+' '+width+'×'+height).toBeLessThanOrEqual(result.available+2);
    }
  }
});

test('home opening fits the desktop window and the finale matches the footer',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const [width,height] of [[1280,720],[1536,792],[1440,900],[1920,1080]]){
    await page.setViewportSize({width,height});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
    const bounds=await page.locator('.home-opening').boundingBox();
    expect(bounds!.y+bounds!.height).toBeLessThanOrEqual(height+2);
    const art=await page.locator('.daybreak').boundingBox();expect(art!.height).toBeGreaterThan(149);
  }
  await expect(page.locator('.closing__frame')).toHaveCSS('background-color','rgb(168, 218, 249)');
  const footerColor=await page.locator('.site-footer').evaluate(el=>getComputedStyle(el).backgroundColor);
  await expect(page.locator('.closing')).toHaveCSS('background-color',footerColor);
  await expect(page.locator('.closing__name')).toHaveCSS('color','rgb(14, 68, 144)');
});

test('native scrolling supports wheel and keyboard without an overlay control',async({page})=>{
  await page.goto('/research');await page.mouse.move(600,400);await page.mouse.wheel(0,700);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(0);
  await page.keyboard.press('End');await expect.poll(()=>page.evaluate(()=>Math.abs(scrollY+innerHeight-document.documentElement.scrollHeight))).toBeLessThan(2);
  await page.keyboard.press('Home');await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
  await expect(page.locator('[data-dawn-scrollbar]')).toHaveCount(0);
});

test('native scrollbar backing follows paper, sky and blue sections',async({page})=>{
  await page.goto('/');await page.waitForTimeout(3300);
  await expect(page.locator('html')).toHaveCSS('background-color','rgb(252, 248, 245)');
  await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
  await expect(page.locator('html')).toHaveCSS('background-color','rgb(168, 218, 249)');
  await expect.poll(()=>page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-backdrop'))).toContain('rgb(168, 218, 249)');
  await page.screenshot({path:'output/scrollbar-sky-fixed.png'});
  await page.goto('/about');
  await page.locator('.about-thinking').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY,behavior:'instant'}));
  await expect(page.locator('html')).toHaveCSS('background-color','rgb(14, 68, 144)');
  const gradient=await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-backdrop'));
  expect(gradient).toContain('rgb(252, 248, 245)');expect(gradient).toContain('rgb(14, 68, 144)');
  await page.keyboard.press('Home');await expect(page.locator('html')).toHaveCSS('background-color','rgb(252, 248, 245)');
});
