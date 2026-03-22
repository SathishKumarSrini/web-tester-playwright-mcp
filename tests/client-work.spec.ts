import { test, expect } from '@playwright/test';

test('Services → Explore Our Client Work shows "Client Work"', async ({ page }) => {
  // Navigate to home page
  await page.goto('https://www.epam.com', { timeout: 60000, waitUntil: 'domcontentloaded' });

  // Try to dismiss cookie / consent banner (common variants)
  const cookieSelectors = [
    'button:has-text("Accept")',
    'button:has-text("Accept All")',
    'button:has-text("I Agree")',
    'button:has-text("Agree")',
    'button:has-text("Close")',
    'text=Cookie Policy'
  ];
  for (const sel of cookieSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.count() > 0) {
        await el.click({ timeout: 3000 }).catch(() => { /* ignore click failures */ });
        break;
      }
    } catch {
      // ignore and continue
    }
  }

  // Ensure header is present
  await page.waitForSelector('header', { timeout: 10000 }).catch(() => {});

  // Click the "Services" header link. If click fails, try hover + click as fallback.
  const services = page.getByRole('link', { name: /Services/i }).first();
  if (await services.count() === 0) {
    throw new Error('Header link "Services" not found');
  }
  try {
    await services.click({ timeout: 5000 });
  } catch {
    await services.hover();
    await page.waitForTimeout(300);
    await services.click({ timeout: 5000 }).catch(() => { /* final fallback ignored */ });
  }

  // Wait for Services page to load
  await page.waitForLoadState('networkidle');

  // Locate and click "Explore Our Client Work" with tolerant selectors
  const exploreSelectors = [
    page.getByRole('link', { name: /Explore Our Client Work/i }).first(),
    page.locator('a:has-text("Explore Our Client Work")').first(),
    page.locator('text=/Explore\\s+Our\\s+Client\\s+Work/i').first(),
    page.locator('a:has-text("Explore Client Work")').first()
  ];

  let exploreFound = false;
  for (const locator of exploreSelectors) {
    if (locator && (await locator.count()) > 0) {
      await locator.click({ timeout: 8000 }).catch(() => { /* ignore click error and try next */ });
      exploreFound = true;
      break;
    }
  }
  if (!exploreFound) {
    throw new Error('Could not find "Explore Our Client Work" link on the Services page');
  }

  // Wait for the target page/section to load
  await page.waitForLoadState('networkidle');

  // Verify that "Client Work" text is visible somewhere on the page
  const clientWorkLocator = page.locator('text=Client Work').first();
  await expect(clientWorkLocator).toBeVisible({ timeout: 15000 });

  // Save a screenshot for evidence
  await page.screenshot({ path: 'client-work-result.png', fullPage: true });
});
