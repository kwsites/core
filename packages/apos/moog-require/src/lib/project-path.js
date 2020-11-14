const path = require('path');
const glob = require('glob');

module.exports = function getProjectPath(self) {
   const cache = {};
   const log = self.log.bind(null, 'getProjectPath:%s %s');

   return function (type) {
      const prefix = self.options.localModules + ((self.options.nestedModuleSubdirs && '/**') || '');
      const suffix = 'index.{js,ts}';

      const search = glob.sync(`${prefix}/${type}/${suffix}`, { cache });
      switch (search.length) {
         case 0:
            log(type, 'NOT_FOUND');
            return `${self.options.localModules}/${type}/index.js`;
         case 1:
            log(type, search[0]);
            return path.normalize(search[0]);
         default:
            log(type, search.length);
            throw new Error(`The module "${type}" appears in multiple locations: ${JSON.stringify(search)}`);
      }
   };
};
