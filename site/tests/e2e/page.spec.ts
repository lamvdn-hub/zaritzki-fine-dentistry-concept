import { expect, test } from '@playwright/test';

test('assembles the visit in order without crossing the server/client boundary', async ({ page }) => {
  const response = await page.goto('/en', { waitUntil: 'domcontentloaded' });

  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1, name: 'A calmer kind of dental visit' })).toBeVisible();
  await expect(page.locator('main#content')).toContainText('Ready when you are');

  const orderedAnchors = await page.locator('main#content > section[id]').evaluateAll((sections) =>
    sections.map((section) => section.id),
  );
  expect(orderedAnchors).toEqual([
    'step-street',
    'step-lounge',
    'step-talk',
    'step-room',
    'step-leaving',
    'practices',
  ]);
});

test('seeds Charlottenburg from a valid praxis query', async ({ page }) => {
  const response = await page.goto('/en?praxis=charlottenburg', { waitUntil: 'domcontentloaded' });

  expect(response?.status()).toBe(200);
  await expect(page.getByRole('radio', { name: 'Charlottenburg' })).toBeChecked();
  await expect(page.getByTestId('hero-image')).toHaveAttribute(
    'src',
    /charlottenburg%2Fentrance\.jpg|charlottenburg\/entrance\.jpg/,
  );
});

test('rejects inherited object keys as praxis values', async ({ page }) => {
  const response = await page.goto('/en?praxis=constructor', { waitUntil: 'domcontentloaded' });

  expect(response?.status()).toBe(200);
  await expect(page.getByRole('radio', { name: 'Mitte' })).toBeChecked();
  await expect(page.getByTestId('hero-image')).toHaveAttribute(
    'src',
    /mitte%2Fentrance\.jpg|mitte\/entrance\.jpg/,
  );
});
