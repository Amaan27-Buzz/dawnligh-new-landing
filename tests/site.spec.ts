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
