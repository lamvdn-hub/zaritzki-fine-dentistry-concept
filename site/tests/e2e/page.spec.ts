import { expect, type Page, test } from '@playwright/test';

async function clearanceBelowFixedChrome(page: Page, targetSelector: string) {
  return page.evaluate((selector) => {
    const target = document.querySelector(selector);
    if (!target) throw new Error(`Missing anchor target content: ${selector}`);

    const targetTop = target.getBoundingClientRect().top;
    const occludingBottom = [...document.querySelectorAll('header, nav')].reduce(
      (bottom, element) => {
        const position = getComputedStyle(element).position;
        if (position !== 'fixed' && position !== 'sticky') return bottom;

        const bounds = element.getBoundingClientRect();
        return bounds.top <= targetTop && bounds.bottom > 0
          ? Math.max(bottom, bounds.bottom)
          : bottom;
      },
      0,
    );

    return targetTop - occludingBottom;
  }, targetSelector);
}

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
    /charlottenburg%2Fentrance-chair\.jpg|charlottenburg\/entrance-chair\.jpg/,
  );
});

test('rejects inherited object keys as praxis values', async ({ page }) => {
  const response = await page.goto('/en?praxis=constructor', { waitUntil: 'domcontentloaded' });

  expect(response?.status()).toBe(200);
  await expect(page.getByRole('radio', { name: 'Mitte' })).toBeChecked();
  await expect(page.getByTestId('hero-image')).toHaveAttribute(
    'src',
    /mitte%2Fentrance-chair\.jpg|mitte\/entrance-chair\.jpg/,
  );
});

test('keeps a rail anchor target below fixed page chrome', async ({ page }, testInfo) => {
  await page.goto('/en', { waitUntil: 'domcontentloaded' });
  await page.locator('a[href="#step-talk"]').click();
  await expect(page).toHaveURL(/#step-talk$/);

  if (testInfo.project.name === 'desktop') {
    await expect(page.locator('nav')).toHaveAttribute('data-position', 'fixed');
  }

  await expect
    .poll(() => clearanceBelowFixedChrome(page, '#step-talk .eyebrow'))
    .toBeGreaterThanOrEqual(0);
});

test('keeps a direct non-rail anchor target below fixed page chrome', async ({ page }) => {
  await page.goto('/en#practices', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/#practices$/);

  await expect
    .poll(() => clearanceBelowFixedChrome(page, '#practices .eyebrow'))
    .toBeGreaterThanOrEqual(0);
});
