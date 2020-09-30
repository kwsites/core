import {
   isPromiseFailure,
   isPromiseSuccess,
   PromiseFailureResult,
   promiseResult,
   promiseResultRejected, promiseResultResolved,
   PromiseSuccessResult
} from '../src';

describe('promise-result', () => {

   it('handles resolved promises', async () => {
      const value = 'good';
      expect(await promiseResult(Promise.resolve(value))).toEqual(expect.objectContaining({
         value,
         result: value,
         success: true,
         threw: false,
      }));
   });

   it('handles rejected promises', async () => {
      const error = new Error('bad');
      expect(await promiseResult(Promise.reject(error))).toEqual(expect.objectContaining({
         error,
         result: error,
         success: false,
         threw: true,
      }));
   });

   it('reports on whether result is a success', async () => {
      const result = await promiseResult(Promise.resolve(''));
      expect(isPromiseFailure(result)).toBe(false);
      expect(isPromiseSuccess(result)).toBe(true);
   });

   it('reports on whether result is a failure', async () => {
      const result = await promiseResult(Promise.reject(new Error('')));
      expect(isPromiseFailure(result)).toBe(true);
      expect(isPromiseSuccess(result)).toBe(false);
   });

   it('checks result was created by this library', async () => {
      const likeSuccess: PromiseSuccessResult<string> = {success: true, threw: false, result: '', value: ''};
      const likeFailure: PromiseFailureResult = {success:false, threw: true, result: new Error(), error: new Error()};

      expect(isPromiseFailure(likeFailure)).toBe(false);
      expect(isPromiseFailure(likeSuccess)).toBe(false);
      expect(isPromiseSuccess(likeFailure)).toBe(false);
      expect(isPromiseSuccess(likeSuccess)).toBe(false);
   });

   it('result type checks cater for unusual input types', async () => {
      [null, undefined, true, false, {}, [], new Map(), new Set()].forEach(input => {
         expect(isPromiseFailure(input)).toBe(false);
         expect(isPromiseSuccess(input)).toBe(false);
      });
   });

   it('failures have an undefined value', async () => {
      const failure = await promiseResultRejected(new Error('Foo'));
      expect('value' in failure).toBe(true);
      expect(failure).toHaveProperty('value', undefined);
   });

   it('successes have an null error', async () => {
      const success = await promiseResultResolved('Foo');
      expect('error' in success).toBe(true);
      expect(success).toHaveProperty('error', null);
   });
});
