import { promiseCache } from './promise-cache';
import { deferred } from '@kwsites/promise-deferred';

describe('promise-cache', () => {
   let yes: Promise<boolean>;
   let no: Promise<boolean>;

   beforeEach(() => {
      yes = Promise.resolve(true);
      no = Promise.resolve(false);
   });

   it('resets ttl on updating', async () => {
      const cache = promiseCache(15);
      cache.set(1, yes);
      cache.set(2, no);

      // first wait is before the TTL for both
      await shortWait();
      expect(cache.has(1)).toBe(true);
      expect(cache.has(2)).toBe(true);

      // refreshing the value (even to same value) restores the TTL for that item
      cache.set(2, no);
      await shortWait();

      // so now the first has expired but the second hasn't yet
      expect(cache.has(1)).toBe(false);
      expect(cache.has(2)).toBe(true);
   });

   it('expires on rejection', async () => {
      const { promise, fail } = deferred();
      const cache = promiseCache(100);
      cache.set('yes', promise);
      expect(cache.has('yes')).toBe(true);

      await shortWait();
      expect(cache.has('yes')).toBe(true);

      fail(new Error('Failing'));
      await shortWait();
      expect(cache.has('yes')).toBe(false);
   });

   it('expires after a ttl', async () => {
      const cache = promiseCache<number, boolean>(10);
      expect(cache.has(1)).toBe(false);

      expect(cache.set(1, yes)).toBe(yes);
      expect(cache.has(1)).toBe(true);

      await wait();
      expect(cache.has(1)).toBe(false);
   });
});

function wait(howLong = 20) {
   return new Promise((done) => setTimeout(done, howLong));
}

function shortWait() {
   return wait(10);
}
