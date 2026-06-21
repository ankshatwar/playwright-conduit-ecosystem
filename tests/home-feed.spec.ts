import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/home.page';
import { FeedLatencyHandler } from '../src/network/feed-latency.handler';

test.describe('Conduit - Home Feed UX Performance & Latency Isolation', () => {
  let homePage: HomePage;
  let feedLatency: FeedLatencyHandler;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    feedLatency = new FeedLatencyHandler(page);
  });

  test.afterEach(async () => {
    await feedLatency.resetGlobalFeedRoute();
  });

  test('should display loading indicators when global feed fetches experience latency', async ({ page }) => {
    // Delay the global feed loading by 3 seconds
    await feedLatency.delayGlobalFeedLoading(3000);

    await homePage.navigate();

    // Verify loading spinner text is visible
    await expect(homePage.loadingSpinner).toBeVisible();
    
    // Verify no articles with content have rendered yet
    await expect(homePage.realArticlePreviews).toHaveCount(0);

    // Ensure the layout populates cleanly after resolving  delay
    await expect(homePage.loadingSpinner).toBeHidden({ timeout: 5000 });
    
    // Verify that actual articles are displayed
    await expect(homePage.realArticlePreviews.first()).toBeVisible();
  });
});