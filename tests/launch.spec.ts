import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';

test('indexable pages have complete metadata, one heading and working internal links',async({page,request})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  const sitemap=await (await request.get('/sitemap.xml')).text();
  const routes=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>new URL(match[1]).pathname);
  const links=new Set<string>();
  const titles=new Set<string>();
  const descriptions=new Set<string>();
  for(const route of routes){
    expect((await page.goto(route))!.ok()).toBeTruthy();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    const title=await page.title(); expect(titles.has(title)).toBeFalsy();titles.add(title);
    const description=await page.locator('meta[name="description"]').getAttribute('content');
    expect(description!.length).toBeGreaterThan(35);expect(descriptions.has(description!)).toBeFalsy();descriptions.add(description!);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://dawnlightlabs.com'+(route==='/'?'/':route));
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content','https://dawnlightlabs.com/social-preview.png');
    await expect(page.locator('img:not([alt])')).toHaveCount(0);
    const hrefs=await page.locator('a[href^="/"],a[href^="#"]').evaluateAll(elements=>elements.map(el=>el.getAttribute('href')!));
    for(const href of hrefs){
      if(href.startsWith('#'))expect(await page.locator('[id="'+href.slice(1)+'"]').count(),route+href).toBe(1);
      else links.add(href);
    }
    expect(await page.evaluate(()=>document.cookie)).toBe('');
    expect(await page.evaluate(()=>localStorage.length+sessionStorage.length)).toBe(0);
  }
  for(const link of [...links,'/social-preview.png','/apple-touch-icon.png'])expect((await request.get(link)).ok(),link).toBeTruthy();
  await page.goto('/missing-page-for-launch-check');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex, follow');
});

test('no analytics requests on local builds; production gate and URL redaction stay configured',async({page})=>{
  const tracking:string[]=[];
  page.on('request',request=>{if(request.url().includes('/insights/')||request.url().includes('/_vercel/'))tracking.push(request.url())});
  await page.goto('/?email=private@example.com#private');
  await page.waitForTimeout(400);
  await expect(page.locator('body')).toHaveAttribute('data-analytics','false');
  expect(tracking).toEqual([]);
  const source=readFileSync('src/scripts/analytics.ts','utf8');
  expect(source).toContain("url.search = ''");expect(source).toContain("url.hash = ''");
  const config=JSON.parse(readFileSync('vercel.json','utf8'));
  expect(config.framework).toBe('astro');expect(config.outputDirectory).toBe('dist');
  expect(config.rewrites).toBeUndefined();
});

test('scroll-linked daybreak moves and only one transient orbit is drawn',async({page})=>{
  await page.goto('/');
  await expect(page.locator('[data-intro]')).toHaveCount(0,{timeout:8000});
  const orb=page.locator('.daybreak img');
  const initial=await orb.evaluate(el=>getComputedStyle(el).transform);
  await page.evaluate(()=>scrollTo({top:500,behavior:'instant'}));
  await page.waitForTimeout(1000);
  expect(await orb.evaluate(el=>getComputedStyle(el).transform)).not.toBe(initial);
  await expect(page.locator('.closing__orbit-track')).toHaveCount(1);
});

test('enabled analytics loads the SDK, redacts URLs and respects Do Not Track',async({page})=>{
  await page.route('**/_vercel/insights/script.js',route=>route.fulfill({contentType:'text/javascript',body:''}));
  await page.route('**/contact*',async route=>{
    const response=await route.fetch();
    await route.fulfill({response,body:(await response.text()).replace('data-analytics="false"','data-analytics="true"')});
  });
  await page.goto('/contact?email=private@example.com#message');
  await expect(page.locator('script[src="/_vercel/insights/script.js"]')).toHaveCount(1);
  const cleaned=await page.evaluate(()=>{
    const hook=(window as any).vaq.find((entry:any[])=>entry[0]==='beforeSend')[1];
    return hook({type:'pageview',url:location.href});
  });
  expect(cleaned).toEqual({type:'pageview',url:'http://127.0.0.1:4321/contact'});
  await page.addInitScript(()=>Object.defineProperty(navigator,'doNotTrack',{get:()=> '1'}));
  await page.reload();
  await expect(page.locator('body')).toHaveAttribute('data-analytics','true');
  await page.waitForTimeout(200);
  await expect(page.locator('script[src="/_vercel/insights/script.js"]')).toHaveCount(0);
});

test('all screens pass automated accessibility checks on desktop and mobile',async({page})=>{
  test.setTimeout(120000);
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:900});
    for(const route of ['/','/research','/projects','/projects/oscar','/projects/takokit','/projects/kinetable','/projects/aish','/about','/contact','/faq','/privacy','/terms','/404','/notes','/notes/local-voice-runtime','/notes/efficient-intelligence','/notes/understanding-circuits','/research/programs','/site-map']){
      await page.goto(route);await page.evaluate(()=>document.fonts.ready);
      const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),route+' at '+width).toEqual([]);
    }
  }
});
