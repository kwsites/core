const relative = require('path').resolve.bind(null, __dirname);

module.exports = {
   setupFiles: [relative('./setup-files')],
   setupFilesAfterEnv: [relative('./setup-files-after-env')],
   testPathIgnorePatterns: ['/node_modules/', '<rootDir>/lib/', '<rootDir>/dist/'],
   collectCoverageFrom: ['**/*.{js,ts}', '!**/*.d.ts', '!**/*.config.js'],
   coveragePathIgnorePatterns: ['/node_modules/', '/__mocks__/', '/__fixtures__/', '<rootDir>/coverage/'],
};
