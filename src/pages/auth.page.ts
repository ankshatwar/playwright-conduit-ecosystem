import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export default class AuthPage extends BasePage {
  private readonly loginUrl = '/login';
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly validationErrors: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.validationErrors = page.locator('ul.error-messages');
  }

  async navigateToLogin(): Promise<void> {
    await this.navigateTo(this.loginUrl);
  }

  async login(email: string, password: string): Promise<void> {
    await this.safeType(this.emailInput, email);
    await this.safeType(this.passwordInput, password);
    await this.safeClick(this.signInButton);
  }

  async verifyLoginErrors(expectedMessages: string[]): Promise<void> {
    await expect(this.validationErrors).toBeVisible();
    await expect(this.validationErrors.locator('li')).toContainText(expectedMessages);
  }
}
