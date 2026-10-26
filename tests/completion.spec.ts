import { test, expect } from '@playwright/test';
for(const path of ['/projects','/projects/takokit']){
test('voice directions are understandable and selectable on '+path,async({page})=>{
  await page.goto(path);
  const sketch=page.locator('[data-sketch="takokit"]');
  await sketch.getByRole('button',{name:'Speak',exact:true}).click();
  await expect(sketch.locator('[data-voice-mode]')).toHaveAttribute('data-voice-mode','speak');
  await expect(sketch.getByRole('button',{name:'Speak',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(sketch.locator('[data-voice-output]')).toHaveText('Speech out');
  await expect(sketch.locator('.voice-speech')).toBeVisible();
  await sketch.getByRole('button',{name:'Listen',exact:true}).click();
  await expect(sketch.locator('[data-voice-input]')).toHaveText('Speech in');
  await expect(sketch.locator('.voice-speech')).toBeHidden();
});
}
test('OSCAR returns work for review without changing the page layout',async({page})=>{
  await page.goto('/projects/oscar');
  const sketch=page.locator('[data-sketch="oscar"]');
  const before=await sketch.boundingBox();
  await sketch.getByRole('button',{name:'Review the plan'}).click();
  await expect(sketch.locator('[data-worker-review]')).toBeVisible();
  await expect(sketch.locator('.coordination__workers')).toBeHidden();
  expect((await sketch.boundingBox())!.height).toBeCloseTo(before!.height, 1);
  await sketch.getByRole('button',{name:'Back to the Workers'}).click();
  await expect(sketch.locator('.coordination__workers')).toBeVisible();
});
test('circuit connections follow pointer and keyboard movement, staying in bounds',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/projects/kinetable');
  const node=page.locator('[data-part="resistor"]');
  const wire=page.locator('[data-wire]');
  await node.scrollIntoViewIfNeeded();
  const initial=await wire.getAttribute('d');
  await node.focus();
  await page.keyboard.press('ArrowRight');
  expect(await wire.getAttribute('d')).not.toBe(initial);
  const box=await node.boundingBox();
  await page.mouse.move(box!.x+box!.width/2,box!.y+box!.height/2);
  await page.mouse.down();await page.mouse.move(0,0,{steps:6});await page.mouse.up();
  const moved=await node.boundingBox();
  const board=await page.locator('.circuit-sketch').boundingBox();
  expect(moved!.x).toBeGreaterThanOrEqual(board!.x);
  expect(moved!.y).toBeGreaterThanOrEqual(board!.y);
  const led=page.locator('[data-part="led"]');
  await led.focus();await page.keyboard.press('ArrowLeft');
  expect(await page.locator('.circuit-mark').evaluate(el=>(el as HTMLElement).style.left)).toBe(await led.evaluate(el=>(el as HTMLElement).style.left));
});
test('shell examples reset explanations and never claim real execution',async({page})=>{
  await page.goto('/projects/aish');
  const sketch=page.locator('[data-sketch="aish"]');
  await expect(sketch.locator('[data-shell-command]')).toContainText('{}');
  await sketch.getByRole('button',{name:'Explain',exact:true}).click();
  await expect(sketch.locator('[data-shell-explanation]')).toBeVisible();
  await sketch.getByRole('button',{name:'Approve',exact:true}).click();
  await expect(sketch.locator('[data-shell-status]')).toContainText('Nothing is executed');
  await sketch.getByRole('button',{name:'Check this folder',exact:true}).click();
  await expect(sketch.locator('[data-shell-command]')).toHaveText('ls -lah');
  await expect(sketch.locator('[data-shell-explanation]')).toBeHidden();
  await expect(sketch.getByRole('button',{name:'Explain',exact:true})).toHaveAttribute('aria-expanded','false');
  await sketch.getByRole('button',{name:'Dismiss',exact:true}).click();
  await expect(sketch.locator('[data-shell-status]')).toContainText('Dismissed');
  await sketch.getByRole('button',{name:'See recent commits',exact:true}).click();
  await expect(sketch.locator('[data-shell-command]')).toHaveText('git log -5 --oneline');
});
test('contact copies the real address and About contains the founders',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/contact');
  await expect(page.getByRole('link',{name:'contact@dawnlightlabs.com',exact:true}).first()).toHaveAttribute('href','mailto:contact@dawnlightlabs.com');
  await page.getByRole('button',{name:'Copy address'}).click();
  await expect(page.locator('[data-copy-status]')).toHaveText('Address copied.');
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('contact@dawnlightlabs.com');
  await page.goto('/about');
  await expect(page.getByRole('heading',{name:'Amaan Syed'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Sairaj Jawalikar'})).toBeVisible();
});
test('public routes and publication boundaries remain intact',async({request})=>{
  const response=await request.get('/sitemap.xml');expect(response.ok()).toBeTruthy();
  const xml=await response.text();for(const slug of ['oscar','takokit','kinetable','aish'])expect(xml).toContain('/projects/'+slug);
  expect(xml).not.toContain('/notes');expect(xml).not.toContain('/404');
  expect((await request.get('/robots.txt')).ok()).toBeTruthy();
});
test('reduced motion keeps interactive content usable and scenes static',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('[data-intro]')).toBeHidden();
  await expect(page.locator('.closing__name')).toHaveCSS('opacity','1');
  await expect(page.locator('.closing__final')).toHaveCSS('opacity','1');
  const animations=await page.evaluate(()=>document.getAnimations().length);
  expect(animations).toBe(0);
  await page.goto('/projects/takokit');
  await page.locator('[data-sketch="takokit"]').getByRole('button',{name:'Speak',exact:true}).click();
  await expect(page.locator('[data-voice-output]')).toHaveText('Speech out');
});
