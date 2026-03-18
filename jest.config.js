module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testTimeout: 10000,
  collectCoverageFrom: ["src/**/*.js", "!src/**/index.js"],
};
