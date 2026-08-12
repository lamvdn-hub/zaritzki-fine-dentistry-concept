import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('has no detectable accessibility violations', async ({ page }) => {
  await page.goto('/en');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('every interactive element is reachable and visibly focused by keyboard', async ({ page }, testInfo) => {
  await page.goto('/en');

  // Chromium's mobile emulation removes links from sequential focus navigation
  // — Tab visits form controls only — so the first tab stop differs by platform.
  // Both projects still assert that Tab reaches the first focusable element and
  // that it carries a visible focus ring.
  const firstStop =
    testInfo.project.name === 'desktop'
      ? page.getByRole('link', { name: /Skip to content/ })
      : page.getByRole('radio', { name: 'Mitte' });

  await page.keyboard.press('Tab');
  await expect(firstStop).toBeFocused();

  const focus = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const style = getComputedStyle(el);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      outlineColor: style.outlineColor,
      boxShadow: style.boxShadow,
    };
  });

  // The system draws the ring with --focus-ring, as an outline or — where a
  // clipping parent would crop one, as on the location switch's overflow:hidden
  // group — as an inset box-shadow. Either counts; nothing counts if it is
  // drawn in some other colour.
  const hasOutline =
    focus.outlineStyle !== 'none' && Number.parseFloat(focus.outlineWidth) > 0;
  expect(
    hasOutline || focus.boxShadow !== 'none',
    `no visible focus indicator: ${JSON.stringify(focus)}`,
  ).toBe(true);
  expect(
    `${focus.outlineColor} ${focus.boxShadow}`,
    'the focus indicator must be drawn with --focus-ring',
  ).toContain('rgba(181, 138, 62, 0.55)');
});

test('honours prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');
  const duration = await page.evaluate(() => {
    const el = document.querySelector('[class*="reveal"]');
    return el ? getComputedStyle(el).transitionDuration : '0s';
  });
  // globals.css floors transitions at 0.01ms under reduced motion, which
  // getComputedStyle serialises as "1e-05s" or "0.00001s" depending on the
  // Chromium build. Compare the value, not its spelling.
  const ms = duration.trim().endsWith('ms')
    ? Number.parseFloat(duration)
    : Number.parseFloat(duration) * 1000;
  expect(ms).toBeLessThanOrEqual(0.01);
});

test('has exactly one h1', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h1')).toHaveCount(1);
});
