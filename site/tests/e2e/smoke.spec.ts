import { expect, test } from '@playwright/test';

test('serves the generated app', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Create Next App');
});
