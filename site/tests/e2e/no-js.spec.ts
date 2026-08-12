import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('the page is complete and both practices reachable without JavaScript', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A calmer kind of dental visit');
  await expect(page.getByText('Jägerstraße 41').first()).toBeVisible();
  await expect(page.getByText('Kurfürstendamm 52').first()).toBeVisible();
  await expect(page.getByText(/We cannot treat statutory patients/)).toBeVisible();
  await expect(page.getByRole('link', { name: /030 854 030 00/ }).first()).toBeVisible();
});
