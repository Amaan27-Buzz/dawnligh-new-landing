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

  // Scroll to an actual intermediate position, not scrollIntoViewIfNeeded,
  // which can land after the pinned animation has already completed.
  const closingTop = await page.locator('[data-closing]').evaluate(element =>
    element.getBoundingClientRect().top + window.scrollY);
  await page.evaluate(y => window.scrollTo({ top: y + window.innerHeight * .36, behavior: 'instant' }), closingTop);
  await page.waitForTimeout(1150);
  const travelerOpacity = await page.locator('.closing__traveler').evaluate(element =>
    parseFloat(getComputedStyle(element).opacity));
  expect(travelerOpacity, 'Orb should be visible while orbiting').toBeGreaterThan(.08);
  await page.screenshot({ path: 'test-results/motion-capture/04-orbit-in-progress.png' });
  await page.evaluate(y => window.scrollTo({ top: y + window.innerHeight * .78, behavior: 'instant' }), closingTop);
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'test-results/motion-capture/04b-orbit-later.png' });
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(1100);
  await page.screenshot({ path: 'test-results/motion-capture/05-exact-final-mark.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('[data-intro]')).toHaveCount(0, { timeout: 8000 });
  await page.screenshot({ path: 'test-results/motion-capture/06-mobile-hero.png' });
});
