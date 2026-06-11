import { Page, Locator } from '@playwright/test';


/* Open-Closed Principle (OCP): This class is open for extension 
  (other pages can inherit it) but closed for modification.
*/
export abstract class BasePage {
    // Encapsulation: Protected ensures only classes extending BasePage can see 'page'
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Centralized navigation
    protected async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
    }

    protected async safeClick(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    protected async safeType(locator: Locator, text: string): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        await locator.fill(text);
    }
}