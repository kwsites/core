describe('instagram-widgets', () => {
   let self, options;
   let instagramWidgetsModule;

   beforeEach(() => {
      instagramWidgetsModule = Object.assign({}, require('../index'));
      self = {
         getOption() {},
         load() {},
         log: Object.assign(function () {}, { extend() {} }),
         pushAsset() {},
         pushAssets() {},
         sanitize() {},
      };
   });

   it('constructs', () => {
      expect(() => instagramWidgetsModule.construct(self, (options = {}))).not.toThrow();
   });
});
