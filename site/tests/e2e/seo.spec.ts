import { test, expect } from '@playwright/test';

test('emits one Dentist record per practice with correct address and hours', async ({ page }) => {
  await page.goto('/en');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const records = blocks.map((b) => JSON.parse(b));
  const dentists = records.filter((r) => r['@type'] === 'Dentist');

  expect(dentists).toHaveLength(2);

  const mitte = dentists.find((d) => d.address.streetAddress === 'Jägerstraße 41');
  expect(mitte).toBeDefined();
  expect(mitte.address.postalCode).toBe('10117');
  expect(mitte.telephone).toBe('+493085403000');
  expect(mitte.openingHoursSpecification[0].opens).toBe('08:00');
  expect(mitte.openingHoursSpecification[0].closes).toBe('20:00');
});

test('does not emit self-serving review markup', async ({ page }) => {
  await page.goto('/en');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  for (const block of blocks) {
    expect(block).not.toContain('aggregateRating');
    expect(block).not.toContain('"review"');
  }
});

test('sets the document language and a descriptive title', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/Zaritzki Fine Dentistry/);
});
