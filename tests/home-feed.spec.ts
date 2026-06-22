import { test, expect } from '../src/fixtures/test-base';

test.describe('Conduit - Home Feed UX Performance & Latency Isolation', () => {
  test.afterEach(async ({ feedLatency }) => {
    await feedLatency.resetGlobalFeedRoute();
  });

  test('should display loading indicators when global feed fetches experience latency', async ({ feedLatency, homePage }) => {
    // Delay the global feed loading by 3 seconds
    await feedLatency.delayGlobalFeedLoading(3000);

    await homePage.navigate();

    // Verify loading spinner text is visible
    await expect(homePage.loadingSpinner).toBeVisible();

    // Verify no articles with content have rendered yet
    await expect(homePage.realArticlePreviews).toHaveCount(0);

    // Ensure the layout populates cleanly after resolving  delay
    await expect(homePage.loadingSpinner).toBeHidden();

    // Verify that actual articles are displayed
    await expect(homePage.realArticlePreviews.first()).toBeVisible();
  });
});