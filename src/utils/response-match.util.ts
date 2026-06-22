import { Response } from '@playwright/test';

export interface IResponseMatchUtil {
  matches(response: Response): boolean;
}   

export class GetRequestMatchUtil implements IResponseMatchUtil {
  constructor(
    private readonly urlPattern: string | RegExp,
    private readonly expectedStatus: number = 200
  ) {}

  matches(response: Response): boolean {
    const urlMatches =
      typeof this.urlPattern === 'string'
        ? response.url().includes(this.urlPattern)
        : this.urlPattern.test(response.url());

    return (
      urlMatches &&
      response.request().method() === 'GET' &&
      response.status() === this.expectedStatus
    );
  }
}