import { test, expect } from '../src/fixtures/test-base';
import ArticleViewPage from '../src/pages/article-view.page';


test.describe('New article creation checks', () => {

  test('validate form fields and successfully publish a new article via UI', async ({ page, createArticlePage, articleViewPage }) => {
    const uniqueId = crypto.randomUUID();

    const uniqueTitle = `UI Feature Test ${Date.now()}_${uniqueId}`;
    const description = 'Testing the frontend interface form fields.';
    const body = 'Full detailed article content verification body.';
    const tag = 'frontend';

    await createArticlePage.navigateToEditor();
    await createArticlePage.fillArticleForm(uniqueTitle, description, body, tag);
    await createArticlePage.submitArticle();

    const createdArticleUrl = page.url();

    await expect(page).toHaveURL(new RegExp(`/article/.*`));
    await expect(page.getByRole('heading', { level: 1, name: uniqueTitle })).toBeVisible();
    await expect(page.getByText(body)).toBeVisible();

    await articleViewPage.deleteArticle(uniqueTitle);

    await page.goto(createdArticleUrl);

    await expect(page.getByRole('heading', { level: 1, name: uniqueTitle })).toBeHidden();


  });
});

test.describe('Article favourite - cross-user workflow', () => {
  /*
   * CONSTRAINT: api.realworld.show isolates real user accounts from each other.
   * Articles created by one real account are not visible to other real accounts,
   * making a true cross-user seed-then-favourite flow impossible on this backend.
   *
   * Ideal scenario:
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

    // Perform action or assertion
    await expect(firstHeading).toBeVisible();
    await firstHeading.click();

    await expect(articleView.favoriteButton).toBeVisible();

    await articleView.favoriteArticle();
    await articleView.verifyArticleIsFavorited();

    await readerContext.close();
  });
});
