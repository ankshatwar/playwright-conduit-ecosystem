import { test as setup, expect } from '@playwright/test';
import fs from 'fs';

const authFile = './auth/user.json';

setup('authenticate via backend API layer', async ({ playwright }) => {
  // 1. Initialize API context
  const apiContext = await playwright.request.newContext();
  
  // 2. Post to the API endpoint used by the application
  const response = await apiContext.post('https://api.realworld.show/api/users/login', {
    data: {
      user: {
        email: 'playwright.testmail01@internal-ci.net',
        password: 'SystemRunner2026!#'
      }
    }
  });

  // Verify backend system responds successfully
  expect(response.status()).toBe(200);
  
  const responseBody = await response.json();
  const token = responseBody.user.token;

  // 3. Construct the exact storage state format using 'jwtToken' key
  const storageState = {
    cookies: [],
    origins: [
      {
        origin: 'https://demo.realworld.show',
        localStorage: [
          {
            name: 'jwtToken',
            value: token
          }
        ]
      }
    ]
  };

  // 4. Ensure directory exists and write the JSON file
  fs.mkdirSync('./auth', { recursive: true });
  fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));
  
  await apiContext.dispose();
});