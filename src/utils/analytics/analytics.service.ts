import { HttpStatus, Injectable } from '@nestjs/common';

export interface IAnalytics<TPayload> {
  message: string;
  payload?: TPayload;
  success?: boolean;
  fail?: boolean;
}

// TODO implement additional logic for caching errors using Sentry

@Injectable()
export class AnalyticsService {
  constructor() {}

  success<TPayload>(data: IAnalytics<TPayload>): IAnalytics<TPayload> {
    return { ...data, success: true, fail: false };
  }

  fail<TPayload>(data: IAnalytics<TPayload>): IAnalytics<TPayload> {
    console.log(`===========${data.message}===========`);
    console.log(data.payload);

    return { ...data, fail: true, success: false };
  }

  defineHttpStatus(data: IAnalytics<unknown>): HttpStatus {
    return data.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
  }
}
