import { promiseError } from '../src';

describe('promise-error', () => {

   it('ignores resolved promises', async () => {
      expect(await promiseError(Promise.resolve('anything'))).toBeUndefined();
   });

   it('catches and returns exceptions', async () => {
      const error = new Error('bad');
      expect(await promiseError(Promise.reject(error))).toBe(error);
   });

});
