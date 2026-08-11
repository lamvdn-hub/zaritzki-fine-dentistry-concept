import { expect, test } from '@playwright/test';

test('serves the generated app', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$/);
  await expect(page).toHaveTitle('Zaritzki Fine Dentistry — private dental practice in Berlin');
});
