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

/**
 * This is an unofficial concept for a real practice, so the whole point is that
 * it must NOT be findable. Three independent layers, asserted separately —
 * a regression in any one of them is the single worst failure this demo has.
 */
test('is unindexable by meta tag, by robots.txt, and by response header', async ({ page, request }) => {
  const response = await page.goto('/en');

  const meta = await page.locator('meta[name="robots"]').getAttribute('content');
  expect(meta).toContain('noindex');
  expect(meta).toContain('nofollow');

  expect(response?.headers()['x-robots-tag']).toContain('noindex');

  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toMatch(/User-Agent: \*\s*\nDisallow: \/$/im);
});

test('keeps the images out of the index too', async ({ request }) => {
  // Only the header can carry this — a meta tag cannot, and the images are the
  // part most likely to be mistaken for photographs of the real practice.
  const image = await request.get('/images/mitte/lounge-generated.jpg');
  expect(image.ok()).toBe(true);
  expect(image.headers()['x-robots-tag']).toContain('noimageindex');
});

test('sets the document language and a descriptive title', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/Zaritzki Fine Dentistry/);
});
