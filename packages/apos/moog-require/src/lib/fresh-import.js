const importFresh = require('import-fresh');

module.exports = function getFreshImport(self) {
   return function (path) {
      const imported = importFresh(path);
      const result = (imported && imported.__esModule && imported.default) || imported;

      self.log('getFreshImport:%s %o', String(path).replace(process.cwd(), ''), !!result);

      return result;
   };
};
