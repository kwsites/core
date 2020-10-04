import deferred, { DeferredPromiseStatus } from '../src';

describe(`deferred`, () => {

   const pendingStatus: DeferredPromiseStatus = 'pending';

   it(`imports as deferred`, () => {
      expect(deferred()).toHaveProperty('status', pendingStatus);
   });

})
