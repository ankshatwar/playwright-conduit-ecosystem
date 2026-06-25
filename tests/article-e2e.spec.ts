import { test } from '../src/fixtures/test-base';
import { E2E_ARTICLE_DATA } from '../src/data/articleData';
import { ApiUtils } from '../src/utils/api.util';

test.describe('Conduit Enterprise Article E2E Functional Workflow', () => {
  let articleSlug: string;
  let apiUtils: ApiUtils;
  let currentTestData: ReturnType<typeof E2E_ARTICLE_DATA.generatePayload>;

  test.beforeEach(async ({ playwright }) => {
    // Fresh payload per attempt so retries don't collide on the same slug
    currentTestData = E2E_ARTICLE_DATA.generatePayload();
    apiUtils = new ApiUtils(playwright);
    articleSlug = await apiUtils.createArticleViaApi(currentTestData);
  });

  test('should complete a transactional lifecycle: view, comment, and delete', async ({ articleViewPage }) => {
    // Navigate to the seeded asset via UI
    await articleViewPage.navigateToArticle(articleSlug);

    // Post a comment
    await articleViewPage.addComment(currentTestData.commentText);

    // Assert comment displays correctly
    await articleViewPage.verifyCommentIsVisible(currentTestData.commentText);

  });

  test.afterEach(async () => {
    // Teardown: Clean up the data after the test finishes using shared utility instance
    if (articleSlug && apiUtils) {
      await apiUtils.deleteArticleViaApi(articleSlug);
    }
  });
});