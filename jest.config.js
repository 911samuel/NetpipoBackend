module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.[jt]s?(x)'],
  collectCoverage: true,
  testTimeout: 30000,
  coverageThreshold: {
    global: {
      lines: 50,
    },
  },
};