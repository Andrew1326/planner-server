import { IAnalytics } from '../analytics/analytics.service';

interface ISafeExecutePayload {
  successMessage: string;
  failureMessage: string;
  id: string;
}

export type TSafeExecuteFn = <TResult>(
  messages: ISafeExecutePayload,
) => (fn: Function) => Promise<IAnalytics<TResult | Error>>;

const safeExecute: TSafeExecuteFn = <TResult>({
  successMessage,
  failureMessage,
  id,
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
        id,
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
        id,
      };

      return analytics;
    }
  };
};

export default safeExecute;
