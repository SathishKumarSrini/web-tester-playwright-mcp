import { test, expect } from '@playwright/test';

test('Client Work navigation - EPAM', async ({ page }) => {
  // Navigate to EPAM homepage
  await page.goto('https://www.epam.com/', { waitUntil: 'networkidle' });

  // Click "Services" in the header menu
  await page.click('text=Services', { timeout: 10000 });
  await page.waitForLoadState('networkidle');

  // Click "Explore Our Client Work"
  await page.click('text=Explore Our Client Work', { timeout: 10000 });
  await page.waitForLoadState('networkidle');

  // Verify that the text "Client Work" is visible
  await expect(page.getByText('Client Work')).toBeVisible();
});
