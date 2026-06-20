import { Page } from '@playwright/test';

export abstract class BaseHandler {
  // Marked 'protected' so child handlers can easily access the page context
  constructor(protected readonly page: Page) {}

  /**
   * Method to delay a network route.
   */
  protected async addDelay(urlPattern: string | RegExp, delayMs: number): Promise<void> {
    await this.page.route(urlPattern, async (route) => {
      const response = await route.fetch();
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      await route.fulfill({ response });
    });
  }

  /**
   * Method to safely route intercepts.
   */
  protected async removeRoute(urlPattern: string | RegExp): Promise<void> {
    await this.page.unroute(urlPattern);
  }
}