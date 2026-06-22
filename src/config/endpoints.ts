export const API_ENDPOINTS = {
  ARTICLES: {
    FEED: '**/api/articles**',
    SINGLE: /\/api\/articles\/[^/]+/  
  },
  PROFILES: {
    VIEW: '**/api/profiles/**'
  }
} as const;