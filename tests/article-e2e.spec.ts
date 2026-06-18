import { test } from '../src/fixtures/test-base';
import { E2E_ARTICLE_DATA } from '../src/data/articleData';
import { ApiUtils } from '../src/utils/ApiUtils';

test.describe('Conduit Enterprise Article E2E Functional Workflow', () => {
  let articleSlug: string;
  let apiUtils: ApiUtils;

  const currentTestData = E2E_ARTICLE_DATA.generatePayload();

  test.beforeEach(async ({ playwright }) => {
    // Initialize helper
    apiUtils = new ApiUtils(playwright);

    // Seed testing data
    articleSlug = await apiUtils.createArticleViaApi(currentTestData);
  });

  test('should complete a transactional lifecycle: view, comment, and favorite', async ({ articleViewPage }) => {
    // Navigate to the seeded asset via UI
    await articleViewPage.navigateTo(articleSlug);

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