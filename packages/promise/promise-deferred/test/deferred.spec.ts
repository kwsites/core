import deferred, { DeferredPromise } from '../src';

describe('deferred', () => {

   let handler: any, catcher: any, def: DeferredPromise<any>, result: Promise<any>;

   beforeEach(() => givenDeferred())

   it('creates a PromiseLike', async () => {
      const {promise, fulfilled, status} = def;
      expect(promise).toEqual(expect.objectContaining({
         catch: expect.any(Function),
         then: expect.any(Function),
      }));

      expect(status).toBe('pending');
      expect(fulfilled).toBe(false);
   });

   it('can be resolved', async () => {
      def.done('abc');

      expect(def.status).toBe('resolved');
      expect(def.fulfilled).toBe(true);

      await assertHandled('abc');
   });

   it('can be rejected', async () => {
      const error = new Error('abc');
      def.fail(error);

      expect(def.status).toBe('rejected');
      expect(def.fulfilled).toBe(true);

      await assertCaught(error);
   });

   it('once resolved, cannot be re-fulfilled', async () => {
      def.done('a');
      def.fail(new Error(''));

      expect(def.fulfilled).toBe(true);
      expect(def.status).toBe('resolved');

      await assertHandled('a');
   });

   it('once rejected, cannot be re-fulfilled', async () => {
      def.fail(new Error(''));
      def.done('a');

      expect(def.fulfilled).toBe(true);
      expect(def.status).toBe('rejected');

      await assertCaught();
   });

   async function assertHandled(result: any) {
      await result;
      expect(handler).toHaveBeenCalledWith(result);
      expect(catcher).not.toHaveBeenCalled();
   }

   async function assertCaught(err?: Error) {
      await result;
      expect(handler).not.toHaveBeenCalled();
      expect(catcher).toHaveBeenCalledWith(err || expect.any(Error));
   }

   function givenDeferred() {
      result = (def = deferred<any>()).promise
         .then(handler = jest.fn())
         .catch(catcher = jest.fn())
      ;

      return def;
   }
})
