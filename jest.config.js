// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/apps/bot/test'],
    testMatch: ['**/*.spec.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
    globals: {
      'ts-jest': {
        tsconfig: '<rootDir>/tsconfig.json'
      }
    }
  };
  