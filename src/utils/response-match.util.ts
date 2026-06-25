import { Response } from '@playwright/test';

export interface IResponseMatchUtil {
  matches(response: Response): boolean;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Base implementation — not exported. Consumers use the named subclasses below.
class RequestMatchUtil implements IResponseMatchUtil {
  constructor(
    private readonly urlPattern: string | RegExp,
    private readonly method: HttpMethod,
    private readonly expectedStatus: number
  ) {}

  matches(response: Response): boolean {
    const urlMatches =
      typeof this.urlPattern === 'string'
        ? response.url().includes(this.urlPattern)
        : this.urlPattern.test(response.url());

    return (
      urlMatches &&
      response.request().method() === this.method &&
      response.status() === this.expectedStatus
    );
  }
}

export class GetRequestMatchUtil extends RequestMatchUtil {
  constructor(urlPattern: string | RegExp, expectedStatus = 200) {
    super(urlPattern, 'GET', expectedStatus);
  }
}

export class PostRequestMatchUtil extends RequestMatchUtil {
  constructor(urlPattern: string | RegExp, expectedStatus = 201) {
    super(urlPattern, 'POST', expectedStatus);
  }
}