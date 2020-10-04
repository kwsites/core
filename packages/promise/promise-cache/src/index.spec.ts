import promiseCacheDefault, { FIVE_MINUTES, promiseCache } from './';

describe('package export', () => {
   it('has a default export', () => {
      expect(promiseCacheDefault).toEqual(expect.any(Function));
   });

   it('has a named export', () => {
      expect(promiseCache).toEqual(expect.any(Function));
   });

   it('has utility constants for time periods', () => {
      expect(FIVE_MINUTES).toEqual(expect.any(Number));
   });
});
