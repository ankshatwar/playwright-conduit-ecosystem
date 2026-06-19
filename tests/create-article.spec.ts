import { test, expect } from '../src/fixtures/test-base';

test.describe('New article creation checks', () => {

    test('validate form fields and successfully publish a new article via UI', async ({ page, createArticlePage }) => {
        // Initialize the Page Object Component

        const uniqueTitle = `UI Feature Test ${Date.now()}`;
        const description = 'Testing the frontend interface form fields.';
        const body = 'Full detailed article content verification body.';
        const tag = 'frontend';

        await createArticlePage.navigateToEditor();
        await createArticlePage.fillArticleForm(uniqueTitle, description, body, tag);
        await createArticlePage.submitArticle();

        await expect(page).toHaveURL(new RegExp(`/article/.*`));
        await expect(page.getByRole('heading', { level: 1, name: uniqueTitle })).toBeVisible();
        await expect(page.getByText(body)).toBeVisible();
    });
});