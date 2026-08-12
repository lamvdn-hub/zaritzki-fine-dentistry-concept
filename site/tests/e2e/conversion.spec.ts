import { test, expect } from '@playwright/test';
import { hitTestCentre, settleStickyBar } from './settle';

test('a booking action is visible in the first viewport before any scrolling', async ({ page }) => {
  await page.goto('/en');
  const cta = page.getByRole('link', { name: /Book a first consultation/ }).first();
  await expect(cta).toBeInViewport();
  // toBeInViewport() is geometry only: a button painted over by fixed chrome
  // still intersects the viewport. Settle the client state, then require the
  // button to be the thing a finger would actually land on.
  await settleStickyBar(page);
  await expect(cta).toBeInViewport();
  await expect(hitTestCentre(cta)).resolves.toMatchObject({
    isTopmost: true,
    occludedByStickyBar: false,
  });
});

test('the sticky bar stays hidden over the hero and appears after it', async ({ page }) => {
  await page.goto('/en');
  const bar = page.getByTestId('sticky-bar');
  // Without this the assertion below polls the pre-hydration SSR markup, where
  // data-visible is the literal string "false" no matter what the client does.
  await settleStickyBar(page);
  await expect(bar).toHaveAttribute('data-visible', 'false');
  await expect(bar).not.toBeInViewport();
  await page.getByRole('link', { name: 'The talk' }).click();
  await expect(bar).toHaveAttribute('data-visible', 'true');
  await expect(bar).toBeInViewport();
});

test('switching practice changes address, imagery, and booking destination together', async ({ page }) => {
  await page.goto('/en');
  const before = await page.getByTestId('hero-image').getAttribute('src');
  await expect(page.getByText('Private Zahnarztpraxis · Berlin Mitte')).toBeVisible();

  await page.getByRole('radio', { name: 'Charlottenburg' }).click();

  await expect(page.getByText('Private Zahnarztpraxis · Berlin Charlottenburg')).toBeVisible();
  const after = await page.getByTestId('hero-image').getAttribute('src');
  expect(after).not.toBe(before);
  await expect(page.getByRole('link', { name: /Book at Charlottenburg/ })).toBeVisible();
});

test('the practice choice survives a reload', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('radio', { name: 'Charlottenburg' }).click();
  await page.reload();
  await expect(page.getByRole('radio', { name: 'Charlottenburg' })).toBeChecked();
});

test('a shared ?praxis= link opens on that practice', async ({ page }) => {
  await page.goto('/en?praxis=charlottenburg');
  await expect(page.getByText('Private Zahnarztpraxis · Berlin Charlottenburg')).toBeVisible();
});

test('the step rail navigates and tracks position', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('link', { name: 'The room' }).click();
  await expect(page.locator('#step-room')).toBeInViewport();
  await expect(page.getByRole('link', { name: 'The room' })).toHaveAttribute('aria-current', 'step');
});
