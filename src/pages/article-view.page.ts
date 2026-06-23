import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export default class ArticleViewPage extends BasePage {
  private readonly articleTitle: Locator;
  private readonly commentInput: Locator;
  private readonly postCommentButton: Locator;
  private readonly commentCardBody: Locator;
  public readonly favoriteButton: Locator;
  private readonly unfavoriteButton: Locator;
  private readonly deleteButton: Locator;

  constructor(page: Page) {
    super(page);

    this.articleTitle = page.locator('h1');
    this.commentInput = page.getByPlaceholder('Write a comment...');
    this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
    this.commentCardBody = page.locator('.card-text');
    this.favoriteButton = page.getByRole('button', { name: /favorite article/i }).first();
    this.unfavoriteButton = page.getByRole('button', { name: /unfavorite article/i }).first();
     this.deleteButton = page.getByRole('button', { name: /delete article/i }).first();
  }

  public get title(): Locator {
    return this.articleTitle;
  }

  async navigateToArticle(slug: string): Promise<void> {
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
    await this.favoriteButton.waitFor({ state: 'attached' });
    await this.favoriteButton.scrollIntoViewIfNeeded();
    await this.favoriteButton.click();
  }

  async verifyArticleIsFavorited(): Promise<void> {
    await expect(this.unfavoriteButton).toBeVisible();
  }

  async deleteArticle(articleTitle: string): Promise<void> {
  await expect(this.deleteButton).toBeVisible();
  this.page.once('dialog', async dialog => {
    await dialog.accept();
  });
  await this.deleteButton.click();

  // Wait for the page to navigate away from the article layout page
  await this.page.waitForURL((url) => !url.pathname.includes('/article/'));

  // ASSERTION: Confirm the unique article title is no longer visible anywhere on the screen
  await expect(this.page.getByRole('heading', { name: articleTitle })).toBeHidden();
}

}