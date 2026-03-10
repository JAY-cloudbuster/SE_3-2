import { test, expect } from '@playwright/test';

test('homepage has correct title and renders root element', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/agritech-frontend/i);

  // Expect the root div to be attached and visible
  const rootLocator = page.locator('#root');
  await expect(rootLocator).toBeAttached();
  
  // Also check if any content from the app loads, normally there is some main element or similar
  // Ensure the page doesn't just crash entirely
  await expect(rootLocator).not.toBeEmpty();
});
