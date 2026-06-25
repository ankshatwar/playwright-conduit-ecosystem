import { test, expect } from '../src/fixtures/test-base';
import { CREATE_VALIDATIONS } from '../src/data/articleData';

test.describe('New article creation checks', () => {

  test('should display validation errors when the editor form is submitted empty', async ({ page, createArticlePage }) => {
    await createArticlePage.navigateToEditor();
    await createArticlePage.submitArticle();

    await createArticlePage.verifyValidationErrors([
     CREATE_VALIDATIONS.titleBlankError,
      CREATE_VALIDATIONS.descBlankError,
      CREATE_VALIDATIONS.bodyBlankError,
    ]);
    await expect(page).toHaveURL(/\/editor/);
  });

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