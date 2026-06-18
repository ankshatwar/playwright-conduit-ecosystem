import { test as base } from '@playwright/test';
import CreateArticlePage from '../pages/CreateArticlePage';
import ArticleViewPage from '../pages/ArticleViewPage';

type MyFixtures = {
  createArticlePage: CreateArticlePage;
  articleViewPage: ArticleViewPage;
};

export const test = base.extend<MyFixtures>({
  createArticlePage: async ({ page }, use) => {
    // Instantiates the class automatically before the test starts
    await use(new CreateArticlePage(page));
  },
  articleViewPage: async ({ page }, use) => {
    await use(new ArticleViewPage(page));
  },
});

// Re-export the native expect assertion engine so it is available from this same import path
export { expect } from '@playwright/test';