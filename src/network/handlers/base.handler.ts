import { Page } from '@playwright/test';

export abstract class BaseHandler {
  // Marked 'protected' so child handlers can easily access the page context
  constructor(protected readonly page: Page) {}

  /**
   * Method to delay a network route.
   */
 protected async addDelay(urlPattern: string | RegExp, delayMs: number): Promise<void> {
    await this.page.route(urlPattern, async (route) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        const response = await route.fetch();
        await route.fulfill({ response });
      } catch {
        // Page closed before route completed — safe to ignore during teardown
        await route.abort().catch(() => {});
      }
    });
  }

  /**
   * Method to safely route intercepts.
   */
  protected async removeRoute(urlPattern: string | RegExp): Promise<void> {
    await this.page.unroute(urlPattern);
  }
}