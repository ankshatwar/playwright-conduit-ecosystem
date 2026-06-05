import { test, expect } from '@playwright/test';
import CreateArticlePage from '../src/pages/CreateArticlePage';

test.describe('New article creation checks', () => {

    test('validate form fields and successfully publish a new article via UI', async ({ page }) => {
        // Initialize the Page Object Component
        const createArticlePage = new CreateArticlePage(page);

        const uniqueTitle = `UI Feature Test ${Date.now()}`;
        const description = 'Testing the frontend interface form fields.';
        const body = 'Full detailed article content verification body.';
        const tag = 'frontend';

        await createArticlePage.navigateToEditor();

        await createArticlePage.fillArticleForm(uniqueTitle, description, body, tag);

        await createArticlePage.submitArticle();

        await expect(page).toHaveURL(new RegExp(`/article/.*`));

        await expect(page.getByRole('heading', { level: 1 })).toHaveText(uniqueTitle);

        await expect(page.getByText(body)).toBeVisible();
    });
});