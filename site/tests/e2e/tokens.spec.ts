import { test, expect } from '@playwright/test';

test('design tokens resolve on the document root', async ({ page }) => {
  await page.goto('/');
  const tokens = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return {
      ivory: s.getPropertyValue('--ivory').trim(),
      espresso: s.getPropertyValue('--espresso').trim(),
      gold: s.getPropertyValue('--gold').trim(),
      radiusSm: s.getPropertyValue('--radius-sm').trim(),
      containerMax: s.getPropertyValue('--container-max').trim(),
      durationBase: s.getPropertyValue('--duration-base').trim(),
    };
  });
  expect(tokens.ivory).toBe('#F5F0E6');
  expect(tokens.espresso).toBe('#241A12');
  expect(tokens.gold).toBe('#B58A3E');
  expect(tokens.radiusSm).toBe('4px');
  expect(tokens.containerMax).toBe('1200px');
  expect(tokens.durationBase).toBe('220ms');
});

test('both brand faces are loaded and self-hosted', async ({ page }) => {
  await page.goto('/');
  const families = await page.evaluate(() =>
    Array.from(document.fonts).map((f) => f.family)
  );
  expect(families.join(' ')).toContain('Cormorant');
  expect(families.join(' ')).toContain('Mulish');

  const external = await page.evaluate(() =>
    Array.from(document.querySelectorAll('link[href]'))
      .map((l) => (l as HTMLLinkElement).href)
      .filter((h) => h.includes('fonts.googleapis.com') || h.includes('fonts.gstatic.com'))
  );
  expect(external).toEqual([]);
});
