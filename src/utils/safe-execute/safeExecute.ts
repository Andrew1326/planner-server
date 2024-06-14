import { IAnalytics } from '../analytics/analytics.service';

interface ISafeExecuteMessagePayload {
  successMessage: string;
  failureMessage: string;
}

export type TSafeExecuteFn = <TResult>(
  messages: ISafeExecuteMessagePayload,
) => (fn: Function) => Promise<IAnalytics<TResult | Error>>;

const safeExecute: TSafeExecuteFn = <TResult>({
  successMessage,
  failureMessage,
}) => {
  return async (fn) => {
    try {
      const result = await fn();

      // compose success analytics
      const analytics: IAnalytics<TResult> = {
        message: successMessage,
        payload: result,
        fail: false,
        success: true,
      };

      return analytics;
    } catch (err) {
      console.log(`===========${failureMessage}===========`);
      console.log(err);

      // compose fail analytics
      const analytics: IAnalytics<Error> = {
        message: failureMessage,
        payload: err,
        fail: true,
        success: false,
      };

      return analytics;
    }
  };
};

export default safeExecute;
