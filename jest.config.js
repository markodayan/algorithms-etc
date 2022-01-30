const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  // setupFilesAfterEnv: ['jest-extended/all'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePaths: ['<rootDir>'],
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'v8',
  testTimeout: 30000,
  coveragePathIgnorePatterns: ['src/index.ts', 'node_modules'],
  testPathIgnorePatterns: ['<rootDir>/src/test/junk/'],
};
