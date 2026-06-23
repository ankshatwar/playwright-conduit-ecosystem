import { test as setup, expect } from '@playwright/test';
import fs from 'fs';

const authFile = './.auth/user.json';

setup('authenticate via backend API layer', async ({ playwright }) => {

  const apiContext = await playwright.request.newContext();

  const response = await apiContext.post(`${process.env.API_URL}/users/login`, {
    data: {
      user: {
        email: process.env.CONDUIT_EMAIL,
        password: process.env.CONDUIT_PASSWORD
      }
    }
  });

  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  const token = responseBody.user.token;

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

  fs.mkdirSync('./.auth', { recursive: true });
  fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));

  await apiContext.dispose();
});
