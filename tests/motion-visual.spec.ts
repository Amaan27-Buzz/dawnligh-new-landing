import { test, expect } from '@playwright/test';

test('render opening and closing frames for visual review', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForTimeout(750);
  await page.screenshot({ path: 'test-results/motion-capture/01-opening-sweep.png' });
  await page.waitForTimeout(670);
  await page.screenshot({ path: 'test-results/motion-capture/02-opening-wordmark.png' });
  await expect(page.locator('[data-intro]')).toHaveCount(0, { timeout: 8000 });
  await page.screenshot({ path: 'test-results/motion-capture/03-home-hero.png' });

  await page.locator('[data-closing]').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy({ top: window.innerHeight * .65, behavior: 'instant' }));
  await page.waitForTimeout(1100);
  await page.screenshot({ path: 'test-results/motion-capture/04-orbit-in-progress.png' });
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(1100);
  await page.screenshot({ path: 'test-results/motion-capture/05-exact-final-mark.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('[data-intro]')).toHaveCount(0, { timeout: 8000 });
  await page.screenshot({ path: 'test-results/motion-capture/06-mobile-hero.png' });
});
