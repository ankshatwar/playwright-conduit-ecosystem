import { test, expect } from '../src/fixtures/test-base';
import ArticleViewPage from '../src/pages/article-view.page';

test.describe('Article favourite - cross-user workflow', () => {
  /*
   * CONSTRAINT: api.realworld.show isolates real user accounts from each other.
   * Articles created by one real account are not visible to other real accounts,
   * making a true cross-user seed-then-favourite flow impossible on this backend.
   *
   * Ideal scenario (requires a self-hosted Conduit backend):
   *   1. User 1 creates an article via API
   *   2. User 2 navigates to that article and favourites it
   *
   * Implemented workaround: User 2 picks the first publicly available article
   * from the global feed (authored by a demo account, visible to all users)
   * and favourites it, which correctly validates the favourite UI flow.
   */

  test('reader should be able to favourite a publicly available article', async ({ browser, playwright }) => {
    const readerApiContext = await playwright.request.newContext();
    const loginResponse = await readerApiContext.post(`${process.env.API_URL}/users/login`, {
      data: {
        user: {
          email: process.env.READER_EMAIL,
          password: process.env.READER_PASSWORD
        }
      }
    });
    expect(loginResponse.status()).toBe(200);
    const readerToken = (await loginResponse.json()).user.token;
    await readerApiContext.dispose();

    const readerContext = await browser.newContext({
      storageState: {
        cookies: [],
        origins: [{ origin: 'https://demo.realworld.show', localStorage: [{ name: 'jwtToken', value: readerToken }] }]
      },
      baseURL: process.env.BASE_URL
    });
    const readerPage = await readerContext.newPage();
    const articleView = new ArticleViewPage(readerPage);

    await readerPage.goto('/');
    await expect(readerPage.locator('.navbar-nav')).toContainText('ci_worker_playwright_02');

    // Pick the first available article from the global feed
    const firstHeading = readerPage.getByRole('heading', { level: 1 }).first();
    await expect(firstHeading).toBeVisible();
    await firstHeading.click();

    await expect(articleView.favoriteButton).toBeVisible();
    await articleView.favoriteArticle();
    await articleView.verifyArticleIsFavorited();

    await readerContext.close();
  });
});