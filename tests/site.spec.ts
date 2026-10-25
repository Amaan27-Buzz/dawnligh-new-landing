import { test, expect } from '@playwright/test';

const routes = [
  '/', '/research', '/projects', '/projects/oscar',
  '/projects/kinetable', '/projects/takokit',
  '/projects/aish', '/about', '/contact',
];

for (const width of [390, 1440]) {
  test('all pages have content and no horizontal overflow at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 870 });
    const exceptions: string[] = [];
    page.on('pageerror', (error) => exceptions.push(error.message));
    for (const path of routes) {
      await page.goto(path);
      await expect(page.locator('main h1').first()).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 2) {
        const offenders = await page.evaluate(() => [...document.querySelectorAll('body *')]
          .map((element) => ({ element, rect: element.getBoundingClientRect() }))
          .filter(({ rect }) => rect.right > window.innerWidth + 1)
          .slice(0, 12)
          .map(({ element, rect }) => ({
            tag: element.tagName,
            cls: (element as HTMLElement).className,
            content: element.textContent?.trim().slice(0, 70),
            left: Math.round(rect.left), right: Math.round(rect.right),
            width: Math.round(rect.width),
          })));
        console.log('Overflow diagnostics for', path, JSON.stringify(offenders));
      }
      expect(overflow, 'Horizontal overflow at ' + path).toBeLessThanOrEqual(2);
    }
    expect(exceptions).toEqual([]);
  });
}

test('home renders approved project visuals and original identity assets', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.project-card')).toHaveCount(4);
  for (const slug of ['oscar', 'kinetable', 'takokit', 'aish']) {
    await expect(page.locator('.project-card--' + slug)).toHaveAttribute('href', '/projects/' + slug);
  }
  await page.locator('.closing__final').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.querySelectorAll('.hero-orb img, .closing__final')].every((node) => {
    const image = node as HTMLImageElement;
    return image.complete && image.naturalWidth > 0;
  }));
  const images = await page.locator('.hero-orb img, .closing__final').evaluateAll(
    (items) => items.map((item) => {
      const image = item as HTMLImageElement;
      return { src: image.currentSrc, complete: image.complete, width: image.naturalWidth };
    })
  );
  expect(images.every((image) => image.complete && image.width > 0)).toBeTruthy();
});

test('mobile navigation is keyboard-dismissable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open navigation' });
  await menu.click();
  await expect(page.getByRole('button', { name: 'Close navigation' })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Research' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
});

test('reduced-motion visitors receive static fully visible identity', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const mask = await page.locator('.hero-orb__lit').evaluate((node) => getComputedStyle(node).maskImage);
  expect(mask).toBe('none');
  await expect(page.locator('.closing__final')).toHaveCSS('opacity', '1');
});


test('opening animation visibly sweeps the original orb and reveals the wordmark', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const intro = page.locator('[data-intro]');
  const mark = intro.locator('[data-intro-mark]');
  await expect(intro).toBeVisible();
  await expect(mark).toHaveCount(1);
  const angleAtStart = await mark.evaluate(element =>
    parseFloat((element as HTMLElement).style.getPropertyValue('--sweep')) || 0);
  await page.waitForTimeout(1050);
  const angleInMotion = await mark.evaluate(element =>
    parseFloat((element as HTMLElement).style.getPropertyValue('--sweep')) || 0);
  expect(angleInMotion, 'Intro must show an actual changing crescent mask').toBeGreaterThan(angleAtStart + 65);
  const wordmarkOpacity = await intro.locator('[data-intro-words]').evaluate(element =>
    parseFloat(getComputedStyle(element).opacity));
  expect(wordmarkOpacity).toBeGreaterThan(.1);
  await expect(intro).toHaveCount(0, { timeout: 8000 });
  await expect(page.locator('.hero h1')).toBeVisible();
});

test('closing orbit resolves to the exact supplied sun-and-orb source SVG', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-intro]')).toHaveCount(0, { timeout: 8000 });
  await page.locator('[data-closing]').scrollIntoViewIfNeeded();
  const before = await page.locator('.closing__final').evaluate(element =>
    parseFloat(getComputedStyle(element).opacity));
  // Traverse the complete scrubbed/pinned orbital sequence.
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(1400);
  const after = await page.locator('.closing__final').evaluate(element =>
    parseFloat(getComputedStyle(element).opacity));
  expect(after, 'Final exact SVG should be fully shown').toBeGreaterThan(.95);
  expect(after).toBeGreaterThanOrEqual(before);
  await expect(page.locator('.closing__name')).toContainText('DAWNLIGHT');
  const sources = await page.locator('.closing__final, .closing__sun-disc, .closing__traveler').evaluateAll(
    elements => elements.map(element => ({
      url: (element as HTMLImageElement).currentSrc,
      loaded: (element as HTMLImageElement).naturalWidth > 0,
    }))
  );
  expect(sources.every(source => source.loaded)).toBeTruthy();
  expect(sources[0].url).toContain('dawnlight%20with%20sun%20svg.svg');
});

test('reduced motion skips opening and retains the final composite', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-intro]')).toBeHidden();
  await expect(page.locator('.closing__final')).toHaveCSS('opacity', '1');
  await expect(page.locator('.closing__name')).toHaveCSS('opacity', '1');
});
