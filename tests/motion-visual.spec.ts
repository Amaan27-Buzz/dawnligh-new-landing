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
  // Pause inside the pinned hold, before the footer pushes the finale offscreen.
  await page.evaluate(y => window.scrollTo({ top: y + window.innerHeight * 1.13, behavior: 'instant' }), closingTop);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'test-results/motion-capture/05-exact-final-mark.png' });
  await page.goto('/research');
  await page.locator('[data-research-atlas]').screenshot({ path: 'test-results/motion-capture/06-research-atlas.png' });
  await page.locator('[data-atlas-trigger="3"]').click();
  await page.waitForTimeout(700);
  await page.locator('[data-research-atlas]').screenshot({ path: 'test-results/motion-capture/07-research-multimodal.png' });
  await page.goto('/');
  await expect(page.locator('[data-intro]')).toHaveCount(0, { timeout: 8000 });
  const galleryCards = page.locator('.project-grid .project-card');
  for (const card of await galleryCards.all()) {
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(370);
  }
  await page.waitForTimeout(1100);
  for (const card of await galleryCards.all()) {
    const opacity = await card.evaluate(element => Number.parseFloat(getComputedStyle(element).opacity));
    expect(opacity).toBeGreaterThan(.97);
  }
  // The sticky header belongs in the page, not over the isolated artwork screenshot.
  await page.locator('.site-header').evaluate(element => { (element as HTMLElement).style.visibility = 'hidden'; });
  await page.locator('.project-grid').first().screenshot({ path: 'test-results/motion-capture/08-cinematic-project-gallery.png' });
  await page.locator('.site-header').evaluate(element => { (element as HTMLElement).style.visibility = ''; });
    await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('[data-intro]')).toHaveCount(0, { timeout: 8000 });
  await page.screenshot({ path: 'test-results/motion-capture/06-mobile-hero.png' });
});
