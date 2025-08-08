import { test, expect } from '@playwright/test';

test('homepage renders and CTA is present', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'File Privacy Inspector' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: 'https://aaacoder.xyz/' })).toBeVisible();
});

test('footer includes long-tail keywords', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/metadata removal tool/i)).toBeVisible();
  await expect(page.getByText(/file privacy analyzer/i)).toBeVisible();
});



