import { HttpStatus, Injectable } from '@nestjs/common';

export interface IAnalytics<TPayload> {
  message: string;
  payload?: TPayload;
  success?: boolean;
  fail?: boolean;
  id: string;
}

export interface IProvidePayload {
  successMessage: string;
  failureMessage: string;
  id: string;
}

// TODO implement additional logic for caching errors using Sentry

@Injectable()
export class AnalyticsService {
  constructor() {}

  // method to output success analytics
  analyticsSuccess<TPayload>(data: IAnalytics<TPayload>): IAnalytics<TPayload> {
    return { ...data, success: true, fail: false };
  }

  // method to output fail analytics
  analyticsFail<TPayload>(data: IAnalytics<TPayload>): IAnalytics<TPayload> {
    console.log(`===========${data.message}===========`);
    console.log(data.payload);

    return { ...data, fail: true, success: false };
  }

  // method to define http status based on analytics
  defineHttpStatus(data: IAnalytics<unknown>): HttpStatus {
    return data.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
  }

  // method for executing function and providing analytics
  provideAnalytics<TResult>({
    successMessage,
    failureMessage,
    id,
  }: IProvidePayload): (fn: Function) => Promise<IAnalytics<TResult | Error>> {
    return async (fn: Function) => {
      try {
        // execute fn
        const result = await fn();

        // compose success analytics
        return this.analyticsSuccess<TResult>({
          message: successMessage,
          payload: result,
          fail: false,
          success: true,
          id,
        });
      } catch (err) {
        // compose fail analytics
        return this.analyticsFail<Error>({
          message: failureMessage,
          payload: err,
          fail: true,
          success: false,
          id,
        });
      }
    };
  }
}
