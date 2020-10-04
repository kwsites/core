import def, { DeferredPromiseStatus } from '../src';

describe(`default`, () => {

   const pendingStatus: DeferredPromiseStatus = 'pending';

   it(`imports as deferred`, () => {
      expect(def()).toHaveProperty('status', pendingStatus);
   });

})
