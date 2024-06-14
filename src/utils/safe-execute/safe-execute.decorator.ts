import { IAnalytics } from '../analytics/analytics.service';

interface ISafeExecutePayload {
  successMessage: string;
  failureMessage: string;
}

// decorator catches error on method level
const SafeExecute = <TResult>({
  successMessage,
  failureMessage,
}: ISafeExecutePayload) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      ...args: any[]
    ): Promise<IAnalytics<TResult | Error>> {
      // performing operation in safe mode
      try {
        // call function
        const result = await originalMethod.apply(this, args);

        // compose success analytics
        const analytics: IAnalytics<TResult> = {
          message: successMessage,
          payload: result,
          fail: true,
          success: false,
        };

        return analytics;
      } catch (err) {
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

    return descriptor;
  };
};

export default SafeExecute;
