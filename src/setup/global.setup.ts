import { test as setup, expect } from '@playwright/test';

const authFile = './.auth/user.json';

setup('authenticate via backend API layer', async ({ request }) => {
  const response = await request.post('https://realworld.io', {
    data: {
      user: {
        email: 'playwright.testmail01@internal-ci.net', // ◄ Enterprise CI email
        password: 'SystemRunner2026!#'               // ◄ Enterprise CI password
      }
    }
  });

  // Verify backend system responds successfully
  expect(response.status()).toBe(200);
  await request.storageState({ path: authFile });
});