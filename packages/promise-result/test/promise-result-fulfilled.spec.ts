import { promiseResultRejected, promiseResultResolved } from '../src';

describe('promise-result fulfilled', () => {

   it('already resolved promise', async () => {
      expect(await promiseResultResolved('hello')).toEqual(expect.objectContaining({
         value: 'hello',
         success: true,
         threw: false,
      }));
   });

   it('already rejected promise', async () => {
      const error = new Error('bad');
      expect(await promiseResultRejected(error)).toEqual(expect.objectContaining({
         error,
         success: false,
         threw: true,
      }));
   });

});
