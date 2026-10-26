import { test, expect } from '@playwright/test';
const routes = ['/', '/research', '/projects', '/projects/oscar', '/projects/takokit', '/projects/kinetable', '/projects/aish', '/about', '/contact', '/faq', '/privacy', '/terms', '/404', '/notes', '/notes/local-voice-runtime', '/notes/efficient-intelligence', '/notes/understanding-circuits', '/research/programs', '/site-map'];
for (const width of [320,390,768,1024,1440,1920]) {
  test('all public pages fit and run at '+width+'px', async ({ page }) => {
    await page.setViewportSize({width,height:870});
    const errors: string[] = [];
    page.on('pageerror',error=>errors.push(error.message));
    for(const path of routes) {
      await page.goto(path);
      await expect(page.locator('main h1')).toBeVisible();
      await page.evaluate(()=>document.fonts.ready);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),path).toBeLessThanOrEqual(2);
      await page.locator('img[loading="lazy"]').evaluateAll(images=>images.forEach(img=>(img as HTMLImageElement).loading='eager'));
      await expect.poll(()=>page.evaluate(()=>Array.from(document.images).filter(img=>!img.complete||!img.naturalWidth).map(img=>img.src)),{message:path}).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}
test('mobile menu preserves destinations, traps focus, and dismisses with Escape',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/research');
  const toggle=page.locator('[data-menu-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  const nav=page.getByRole('navigation',{name:'Primary'});
  for(const name of ['Research','Projects','About','Contact'])await expect(nav.getByRole('link',{name})).toBeVisible();
  await expect(page.locator('main')).toHaveAttribute('inert','');
  await nav.getByRole('link',{name:'Contact'}).focus();
  await page.keyboard.press('Tab');
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await expect(toggle).toBeFocused();
  await expect(page.locator('main')).not.toHaveAttribute('inert','');
});
test('project navigation retains its parent context',async({page})=>{
  await page.goto('/projects/aish');
  await expect(page.getByRole('navigation',{name:'Primary'}).getByRole('link',{name:'Projects'})).toHaveAttribute('aria-current','location');
});
test('home routes to all projects and removes ornamental navigation',async({page})=>{
  await page.goto('/');
  for(const name of ['OSCAR','Takokit','KineTable','AiSH'])await expect(page.getByRole('link',{name:'About '+name,exact:true})).toHaveAttribute('href',/\/projects\//);
  expect(await page.locator('body').innerText()).not.toContain('↗');
  await expect(page.locator('[data-research-atlas],.eyebrow')).toHaveCount(0);
  await page.goto('/research');
  await expect(page.locator('.research-fields__list article')).toHaveCount(6);
  await expect(page.locator('.research-writing__list>a')).toHaveCount(3);
});
test('without JavaScript content, mobile destinations, and final identity remain available',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto('/');
  await expect(page.locator('[data-intro]')).toBeHidden();
  await expect(page.getByRole('navigation',{name:'Primary'}).getByRole('link',{name:'Research'})).toBeVisible();
  await page.locator('.closing__final').scrollIntoViewIfNeeded();
  await expect(page.locator('.closing__final')).toBeVisible();
  await expect(page.locator('.closing__name')).toHaveCSS('opacity','1');
  await context.close();
});
