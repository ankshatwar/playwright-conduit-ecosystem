import { test, expect } from '@playwright/test';

test.describe('Enterprise Dashboard Integration', () => {

  test('verify logged in user details', async ({ page }) => {
    await page.goto('/');

    // Assert that the global layout displays the dedicated pipeline handle
    const navigationHeader = page.locator('.navbar');
    await expect(navigationHeader).toContainText('ci_worker_playwright_01'); 
  });
});