import { Page } from '@playwright/test';
import { BaseHandler } from '../handlers/base.handler';

export class FeedLatencyHandler extends BaseHandler {
  // Define the target endpoint configuration as a private, read-only property
  private readonly articlesEndpoint = '**/api/articles**';

  constructor(page: Page) {
    super(page); // Pass page back up to the BaseHandler engine
  }

  /**
   * Business-readable method that maps directly to the home feed context.
   */
  async delayGlobalFeedLoading(durationMs: number): Promise<void> {
    await this.addDelay(this.articlesEndpoint, durationMs);
  }

  /**
   * Targeted cleanup routine to isolate state changes.
   */
  async resetGlobalFeedRoute(): Promise<void> {
    await this.removeRoute(this.articlesEndpoint);
  }
}