module.exports = {
    rootDir: '.',
    preset: 'jest-expo',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    setupFiles: [
        './jest.setup.js'
    ],
    setupFilesAfterEnv: [
        '@testing-library/jest-native/extend-expect'
    ],
    testMatch: [
        '<rootDir>/src/__tests__/**/*.test.js'
    ],
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?/.*|@unimodules/.*|unimodules|sentry-expo|native-base)'
    ],
    clearMocks: true,
    testPathIgnorePatterns: [
        '/node_modules/'
    ],
    collectCoverage: true,
    coverageReporters: ['html', 'text'],
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    }
};
