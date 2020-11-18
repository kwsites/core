const { isPromiseSuccess, promiseResult } = require('@kwsites/promise-result');

function mockCache() {
   const $data = new Map();

   return {
      $data,
      async get(key) {
         const result = $data.get(key);
         if (!result) {
            return;
         }

         return result.data;
      },
      async set(key, data, ttl) {
         $data.set(key, {
            key,
            data,
            ttl,
         });
      },
   };
}

describe('instagram-widgets', () => {
   let self, options, req, cache;
   let instagramWidgetsModule;

   function givenAposStarts(_options = {}) {
      self.options = options = _options;
      instagramWidgetsModule.beforeConstruct(self, options);
      instagramWidgetsModule.construct(self, options);
      instagramWidgetsModule.afterConstruct(self, options);
   }

   beforeEach(() => {
      cache = mockCache();
      req = { data: {} };
      instagramWidgetsModule = Object.assign({}, require('../index'));
      self = {
         __meta: { name: '@kwsites/cms-instagram-widgets' },
         apos: {
            caches: {
               get(name) {
                  return cache;
               },
            },
            oembed: {
               oembetter: {
                  addBefore: jest.fn(),
               },
            },
         },
         emit: jest.fn(),
         getOption(req, key) {
            return self.options[key];
         },
         load(req, widgets, callback) {
            setImmediate(() => callback(null, widgets));
         },
         log: Object.assign(function () {}, { extend() {} }),
         pushAsset() {},
         pushAssets() {},
         sanitize() {},
      };
   });

   it('constructs', () => {
      expect(() => instagramWidgetsModule.construct(self, (options = {}))).not.toThrow();
   });

   it('uses cached profile responses', async () => {
      cache.set('foo', { status: 'OK', error: null, profile: { blah: true }, userName: 'foo' });
      const widget = { username: 'foo' };

      givenAposStarts({
         auth: { user: 'IG_USER', pass: 'IG_PASS' },
      });
      const getLatestGalleryLoader = jest.spyOn(self, 'getLatestGalleryLoader');
      const loaded = await promiseResult(
         new Promise((done, fail) => self.load(req, [widget], (err, data) => (err ? fail(err) : done(data))))
      );

      expect(isPromiseSuccess(loaded)).toBe(true);
      expect(getLatestGalleryLoader).not.toHaveBeenCalled();
      expect(widget._profile).toEqual({ blah: true });
   });

   it('uses cached profile errors', async () => {
      cache.set('foo', { status: 'ERR', error: { statusCode: 429 }, profile: null, userName: 'foo' });
      const widget = { username: 'foo' };

      givenAposStarts({
         auth: { user: 'IG_USER', pass: 'IG_PASS' },
      });
      const getLatestGalleryLoader = jest.spyOn(self, 'getLatestGalleryLoader');

      const loaded = await promiseResult(
         new Promise((done, fail) => self.load(req, [widget], (err, data) => (err ? fail(err) : done(data))))
      );

      expect(isPromiseSuccess(loaded)).toBe(true);
      expect(getLatestGalleryLoader).not.toHaveBeenCalled();
      expect(widget._profile).toBeNull();
   });
});
