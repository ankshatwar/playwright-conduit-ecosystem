import { Page, Locator } from '@playwright/test';

export default class CreateArticlePage {
  private readonly page: Page;
  private readonly titleInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly bodyTextArea: Locator;
  private readonly tagsInput: Locator;
  private readonly publishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Using Playwright's semantic getBy locators
    this.titleInput = page.getByPlaceholder('Article Title');
    this.descriptionInput = page.getByPlaceholder("What's this article about?");
    this.bodyTextArea = page.getByPlaceholder('Write your article (in markdown)');
    this.tagsInput = page.getByPlaceholder('Enter tags');
    
    this.publishButton = page.getByRole('button', { name: 'Publish Article' });
  }

  async navigateToEditor(): Promise<void> {
    await this.page.goto('/editor');
  }

  async fillArticleForm(title: string, description: string, body: string, tag: string): Promise<void> {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.bodyTextArea.fill(body);
    await this.tagsInput.fill(tag);
    await this.tagsInput.press('Enter');
  }

  async submitArticle(): Promise<void> {
    await this.publishButton.click();
  }
}