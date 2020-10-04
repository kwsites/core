import { createDeferred, DeferredPromiseStatus } from '../src';

describe(`createDeferred`, () => {

   const pendingStatus: DeferredPromiseStatus = 'pending';

   it(`imports as createDeferred`, () => {
      expect(createDeferred()).toHaveProperty('status', pendingStatus);
   });

})
