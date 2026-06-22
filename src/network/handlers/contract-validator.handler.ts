import { Page, Response } from '@playwright/test';
import { BaseHandler } from './base.handler';
import { IResponseMatchUtil } from '../../utils/response-match.util';
import { z } from 'zod';

export class ContractValidatorHandler extends BaseHandler {
  constructor(page: Page) {
    super(page);
  }

  async listenAndValidate(
    matchUtil: IResponseMatchUtil,
    schema: z.ZodType
  ): Promise<Response> {
    let contractBreachError: Error | null = null;

    const response = await this.page.waitForResponse(async (response: Response) => {
      if (!matchUtil.matches(response)) return false;

      const payload = await response.json();
      const result = schema.safeParse(payload);

      if (!result.success) {
        const formattedTreeErrors = z.treeifyError(result.error);
        contractBreachError = new Error(
          `[API CONTRACT BREACH DETECTED for ${response.url()}]:\n${JSON.stringify(formattedTreeErrors, null, 2)}`
        );
      }

      return true;
    });

    if (contractBreachError) throw contractBreachError;

    return response;
  }
}