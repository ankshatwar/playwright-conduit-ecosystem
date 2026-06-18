import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export default class ArticleViewPage extends BasePage {
  private readonly articleTitle: Locator;
  private readonly commentInput: Locator;
  private readonly postCommentButton: Locator;
  private readonly commentCardBody: Locator;
  private readonly favoriteButton: Locator;

  constructor(page: Page) {
    super(page);

    this.articleTitle = page.locator('h1');
    this.commentInput = page.getByPlaceholder('Write a comment...');
    this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
    this.commentCardBody = page.locator('.card-text');

    this.favoriteButton = page.getByRole('button', { name: /favorite article/i });
  }

  async navigateTo(slug: string): Promise<void> {
    await this.page.goto(`/article/${slug}`);
    await expect(this.articleTitle).toBeVisible();
  }

  async addComment(commentText: string): Promise<void> {
    await this.safeType(this.commentInput, commentText);
    await this.safeClick(this.postCommentButton);
  }

  async verifyCommentIsVisible(expectedComment: string): Promise<void> {
    await expect(this.commentCardBody.filter({ hasText: expectedComment })).toBeVisible();
  }

  async favoriteArticle(): Promise<void> {
    // Explicitly wait for the dynamic UI element to settle inside the layout
    await this.favoriteButton.waitFor({ state: 'attached' });

    // Clear any pending background animations before interaction
    await this.page.waitForLoadState('networkidle');

    // Fire a direct interaction command
    await this.favoriteButton.click();
  }
}