import crypto from 'crypto';

export const E2E_ARTICLE_DATA = {
  generatePayload: () => {
    // Generates a random string like: "3b2e91a0-7d23-4f9e-9d21-f81492a10b83"
    const uniqueId = crypto.randomUUID();

    return {
      title: `Article E2E Scenario - ${uniqueId}`,
      description: 'Verify E2E workflow for Article lifecycle',
      body: 'Executing a hybrid end-to-end test scenario for Article lifecycle via UI and API',
      tags: ['E2E', 'article', 'workflow'],
      commentText: `Automated confirmation review message - UUID ${uniqueId}`,
    };
  }
};