import { test as base } from '@playwright/test';
import CreateArticlePage from '../pages/create-article.page';
import ArticleViewPage from '../pages/article-view.page';
import AuthPage from '../pages/auth.page';
import { HomePage } from '../pages/home.page';
import { FeedLatencyHandler } from '../network/handlers/feed-latency.handler';
import { ContractValidatorHandler } from '../network/handlers/contract-validator.handler';

// Declare the type signature mappings for all pages and handlers
type MyFixtures = {
  createArticlePage: CreateArticlePage;
  articleViewPage: ArticleViewPage;
  authPage: AuthPage;
  homePage: HomePage;
  feedLatency: FeedLatencyHandler;
  contractValidator: ContractValidatorHandler;
};

// Extend the base test context with the updated types
export const test = base.extend<MyFixtures>({
  createArticlePage: async ({ page }, use) => {
    await use(new CreateArticlePage(page));
  },
  articleViewPage: async ({ page }, use) => {
    await use(new ArticleViewPage(page));
  },
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  feedLatency: async ({ page }, use) => {
    await use(new FeedLatencyHandler(page));
  },
  contractValidator: async ({ page }, use) => {
    await use(new ContractValidatorHandler(page));
  },
});

export { expect } from '@playwright/test';