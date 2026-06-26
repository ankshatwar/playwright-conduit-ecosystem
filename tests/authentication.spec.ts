import { test, expect } from '../src/fixtures/test-base';
import { INVALID_LOGIN_DATA } from '../src/data/articleData';

test.describe('Authentication - Valid flow', () => {

  test('verify logged in user details', async ({ page }) => {
    await page.goto('/');

    const navigationHeader = page.locator('.navbar-nav');
    await expect(navigationHeader).toContainText('ci_worker_playwright_01');
  });
});

test.describe('Authentication - Invalid Login Flow', () => {
  test.beforeEach(async ({ page, authPage }) => {
    // Navigate to the app first to establish the origin — page.evaluate() cannot
    // access localStorage on about:blank due to browser security restrictions.
    // Clearing localStorage after the first goto() drops the pre-loaded JWT token
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await authPage.navigateToLogin();
  });

  test('should display error when credentials do not match any registered account', async ({ page, authPage }) => {
    await authPage.login(INVALID_LOGIN_DATA.email, INVALID_LOGIN_DATA.password);

    await authPage.verifyLoginErrors([INVALID_LOGIN_DATA.errorMessage]);
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display error when a valid email is submitted with an incorrect password', async ({ page, authPage }) => {
    await authPage.login(process.env.CONDUIT_EMAIL!, INVALID_LOGIN_DATA.password);

    await authPage.verifyLoginErrors([INVALID_LOGIN_DATA.errorMessage]);
    await expect(page).toHaveURL(/\/login/);
  });
});
