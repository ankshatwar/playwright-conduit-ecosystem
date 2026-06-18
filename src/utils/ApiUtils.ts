import { expect } from '@playwright/test';
import fs from 'fs';

export class ApiUtils {
  private playwright: any;
  private authFilePath = './.auth/user.json';

  constructor(playwright: any) {
    this.playwright = playwright;
  }

  // Extracts the token dynamically from the saved global state session
  private getAuthToken(): string {
    if (!fs.existsSync(this.authFilePath)) {
      throw new Error(`Auth file missing at ${this.authFilePath}. Run global setup first.`);
    }
    const authState = JSON.parse(fs.readFileSync(this.authFilePath, 'utf-8'));
    const token = authState.origins[0].localStorage.find((item: any) => item.name === 'jwtToken')?.value;

    if (!token) throw new Error('JWT Token not found inside user.json');
    return token;
  }

  // Handles background POST request to seed data
  async createArticleViaApi(payload: any): Promise<string> {
    const token = this.getAuthToken();
    const context = await this.playwright.request.newContext();

    const response = await context.post(`${process.env.API_URL}/articles`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      data: {
        article: {
          title: payload.title,
          description: payload.description,
          body: payload.body,
          tagList: payload.tags,
        },
      },
    });

    // Handle standard success response boundaries dynamically
    expect([200, 201]).toContain(response.status());

    const body = await response.json();
    await context.dispose();
    return body.article.slug;
  }

  // Handles the background DELETE teardown request to prevent data pollution
  async deleteArticleViaApi(slug: string): Promise<void> {
    const token = this.getAuthToken();
    const context = await this.playwright.request.newContext();

    const response = await context.delete(`${process.env.API_URL}/articles/${slug}`, {
      headers: { 'Authorization': `Token ${token}` }
    });

    expect(response.ok()).toBeTruthy();
    await context.dispose();
  }
}