import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly loadingSpinner: Locator;
  readonly articleFeedList: Locator;
  readonly realArticlePreviews: Locator; // Added for precise tracking

  constructor(private readonly page: Page) {
    this.loadingSpinner = page.getByText('Loading articles...');
    this.articleFeedList = page.locator('.article-preview');
    
    // Real articles in Conduit always contain a "Read more..." link inside them
    this.realArticlePreviews = page.locator('.article-preview').filter({ hasText: 'Read more...' });
  }

  async navigate(): Promise<void> {
    await this.page.goto('/');
  }
}