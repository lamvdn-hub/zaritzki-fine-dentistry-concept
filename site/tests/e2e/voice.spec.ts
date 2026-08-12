import { test, expect } from '@playwright/test';

const BANNED = [
  // Urgency and scarcity
  'limited', 'hurry', 'act now', 'don\'t miss', 'only today', 'book now',
  // Superlatives
  'best dentist', 'world-class', 'world class', 'painless', 'guaranteed',
  // The practice's own Doctolib marketing register — facts from it are welcome,
  // these phrasings are not. See HANDOFF.md §5.7.
  'first address', 'first-class', 'exclusive', 'state of the art',
  'demanding patients', 'demanding private patients', 'new era', 'sophisticated dentistry',
];

test('carries no urgency, scarcity, or superlative language', async ({ page }) => {
  await page.goto('/en');
  const text = ((await page.locator('body').textContent()) ?? '').toLowerCase();
  for (const phrase of BANNED) {
    expect(text, `found banned phrase: ${phrase}`).not.toContain(phrase);
  }
});

test('contains no exclamation marks and no emoji', async ({ page }) => {
  await page.goto('/en');
  // body.textContent() also returns the contents of <script>, which on an App
  // Router page is the serialised RSC payload — machine data, not the practice's
  // voice, and it always contains "!" from the escaped "<!--" of the direction
  // contract comment. Read the copy the reader actually gets instead.
  const text = await page.locator('body').evaluate((body) => {
    const clone = body.cloneNode(true) as HTMLElement;
    for (const node of clone.querySelectorAll('script, style, template')) node.remove();
    return clone.textContent ?? '';
  });
  expect(text).not.toContain('!');
  expect(/\p{Extended_Pictographic}/u.test(text)).toBe(false);
});

test('states the insurance position before the visitor can book', async ({ page }) => {
  await page.goto('/en');
  await expect(
    page.getByText('Privately insured and self-paying patients · Monday to Friday, 08:00–20:00'),
  ).toBeInViewport();
});
