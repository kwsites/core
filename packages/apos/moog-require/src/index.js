const _ = require('lodash');
const fs = require('fs');
const npmResolve = require('resolve');
const path = require('path');
const resolveFrom = require('resolve-from');
const debug = require('debug');

module.exports = function (options) {
   const self = require('moog')(options);

   if (!self.options.root) {
      throw 'The root option is required. Pass the node variable "module" as root. This allows moog to require modules on your behalf.';
   }

   self.root = self.options.root;
   self.log = debug('moog-require');
   self.getFreshImport = require('./lib/fresh-import')(self);
   self.getProjectPath = require('./lib/project-path')(self);

   self.bundled = {};

   self.improvements = {};

   if (self.options.bundles) {
      _.each(self.options.bundles, function (bundleName) {
         var bundlePath = getNpmPath(self.root.filename, bundleName);
         if (!bundlePath) {
            throw 'The configured bundle ' + bundleName + ' was not found in npm.';
         }
         var bundle = self.getFreshImport(bundlePath);
         if (!bundle.moogBundle) {
            throw 'The configured bundle ' + bundleName + ' does not export a moogBundle property.';
         }
         var modules = bundle.moogBundle.modules;
         if (!modules) {
            throw (
               'The configured bundle ' +
               bundleName +
               ' does not have a "modules" property within its "moogBundle" property.'
            );
         }
         _.each(modules, function (name) {
            self.bundled[name] = path.normalize(
               path.dirname(bundlePath) + '/' + bundle.moogBundle.directory + '/' + name + '/index.js'
            );
         });
      });
   }

   var superDefine = self.define;
   self.define = function (type, definition, extending) {
      var result;

      // For the define-many-at-once case let the base class do the work
      if (typeof type === 'object') {
         return superDefine(type);
      }

      var projectLevelDefinition;
      var npmDefinition;
      var originalType;
      var projectLevelPath = self.getProjectPath(type);

      if (fs.existsSync(projectLevelPath)) {
         projectLevelDefinition = self.getFreshImport(resolveFrom(path.dirname(self.root.filename), projectLevelPath));
      }

      var relativeTo;
      if (extending) {
         relativeTo = extending.__meta.filename;
      } else {
         relativeTo = self.root.filename;
      }

      var npmPath = getNpmPath(relativeTo, type);
      if (npmPath) {
         npmDefinition = self.getFreshImport(npmPath);
         npmDefinition.__meta = {
            npm: true,
            dirname: path.dirname(npmPath),
            filename: npmPath,
            name: type,
         };
         if (npmDefinition.improve) {
            // Remember which types were actually improvements of other types for
            // the benefit of applications that would otherwise instantiate them all
            self.improvements[type] = true;
            // Improve an existing type with an implicit subclass,
            // rather than defining one under a new name
            originalType = type;
            type = npmDefinition.improve;
            // If necessary, start by autoloading the original type
            if (!self.isDefined(type, { autoload: false })) {
               self.define(type);
            }
         } else if (npmDefinition.replace) {
            // Replace an existing type with the one defined by
            // this npm module
            delete self.definitions[npmDefinition.replace];
            type = npmDefinition.replace;
         }
      }

      if (!(definition || projectLevelDefinition || npmDefinition)) {
         // Can't find it nohow. Use the standard undefined type error message
         return superDefine(type);
      }

      if (!definition) {
         definition = {};
      }

      projectLevelDefinition = projectLevelDefinition || {};

      projectLevelDefinition.__meta = {
         dirname: path.dirname(projectLevelPath),
         filename: projectLevelPath,
      };

      _.defaults(definition, projectLevelDefinition);

      // Insert the npm definition as a defined type, then let the
      // base class define the local definition normally. This results
      // in an implicit base class, allowing local template overrides
      // even if there is no other local code
      if (npmDefinition) {
         result = superDefine(type, npmDefinition);
         if (npmDefinition.improve) {
            // Restore the name of the improving module as otherwise our asset chains have
            // multiple references to my-foo which is ambiguous
            result.__meta.name = originalType;
         }
      }
      result = superDefine(type, definition);
      if (npmDefinition && npmDefinition.improve) {
         // Restore the name of the improving module as otherwise our asset chains have
         // multiple references to my-foo which is ambiguous
         result.__meta.name = self.originalToMy(originalType);
      }
      return result;
   };

   function getNpmPath(parentPath, type) {
      parentPath = path.resolve(parentPath);
      if (_.has(self.bundled, type)) {
         return self.bundled[type];
      }
      try {
         return npmResolve.sync(type, { basedir: path.dirname(parentPath) });
      } catch (e) {
         // Not found via npm. This does not mean it doesn't
         // exist as a project-level thing
         return null;
      }
   }

   self.isImprovement = function (name) {
      return _.has(self.improvements, name);
   };

   return self;
};
