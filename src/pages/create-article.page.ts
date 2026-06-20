import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

// Inheritance: CreateArticlePage inherits all properties and methods from BasePage
export default class CreateArticlePage extends BasePage {

  // Encapsulation: Private ensures these locators cannot be modified outside this class
  private readonly editorUrl = '/editor';
  private readonly titleInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly bodyTextArea: Locator;
  private readonly tagsInput: Locator;
  private readonly publishButton: Locator;

  constructor(page: Page) {
    super(page);

    // Using Playwright's semantic getBy locators
    this.titleInput = page.getByPlaceholder('Article Title');
    this.descriptionInput = page.getByPlaceholder("What's this article about?");
    this.bodyTextArea = page.getByPlaceholder('Write your article (in markdown)');
    this.tagsInput = page.getByPlaceholder('Enter tags');

    this.publishButton = page.getByRole('button', { name: 'Publish Article' });
  }

  async navigateToEditor(): Promise<void> {
    await this.navigateTo(this.editorUrl);

  }

  async fillArticleForm(title: string, description: string, body: string, tag: string): Promise<void> {
    await this.safeType(this.titleInput, title);
    await this.safeType(this.descriptionInput, description);
    await this.safeType(this.bodyTextArea, body);
    await this.safeType(this.tagsInput, tag);

  }

  async submitArticle(): Promise<void> {
    await this.safeClick(this.publishButton);
  }
}