module.exports = {
    preset: 'jest-expo',
    testEnvironment: 'jsdom',
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{js,jsx}",
        "App.js",
        "index.js"
    ],
    coverageReporters: ["html", "text"],
    coverageDirectory: "coverage",
    setupFilesAfterEnv: [
        "@testing-library/jest-native/extend-expect"
    ],
    moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
};
