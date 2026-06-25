import crypto from 'crypto';

// Invalid credentials used for negative authentication test cases.
// Stored here (not in .env) because fake/wrong values are not sensitive
// and should be version-controlled alongside the tests that use them.
export const INVALID_LOGIN_DATA = {
    email: 'not.a.user@invalid.com',
    password: 'WrongPassword999',
    errorMessage: 'credentials invalid',
};

export const CREATE_VALIDATIONS = {
    titleBlankError: `title can't be blank`,
    descBlankError: `description can't be blank`,
    bodyBlankError: `body can't be blank`,
};

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