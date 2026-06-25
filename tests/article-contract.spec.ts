import { test, expect } from '../src/fixtures/test-base';
import { E2E_ARTICLE_DATA } from '../src/data/articleData';
import { ApiUtils } from '../src/utils/api.util';
import { ArticleResponseSchema } from '../src/network/schemas/article.schema';
import { API_ENDPOINTS } from '../src/config/endpoints';
import { GetRequestMatchUtil } from '../src/utils/response-match.util';

test.describe('Conduit - Dynamic API Contract Verification', () => {
  let articleSlug: string;
  let apiUtils: ApiUtils;

  test.beforeEach(async ({ playwright }) => {
    // Fresh payload per attempt so retries don't collide on the same slug
    const testData = E2E_ARTICLE_DATA.generatePayload();
    apiUtils = new ApiUtils(playwright);
    articleSlug = await apiUtils.createArticleViaApi(testData);
  });

  test('should verify API response matches the contract boundaries', async ({ articleViewPage, contractValidator }) => {
    const matchUtil = new GetRequestMatchUtil(API_ENDPOINTS.ARTICLES.SINGLE);

    // Register listener
    const contractPromise = contractValidator.listenAndValidate(
      matchUtil,
      ArticleResponseSchema
    );

    // Trigger navigation that fires the network request
    await articleViewPage.navigateToArticle(articleSlug);

    // Now resolve the response already captured during navigation
    await contractPromise;

    await expect(articleViewPage.title).toBeVisible();
  });

  test.afterEach(async () => {
    if (articleSlug && apiUtils) {
      await apiUtils.deleteArticleViaApi(articleSlug);
    }
  });
});