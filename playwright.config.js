// Configuração Playwright para rodar testes na pasta e2e
// e reconhecer arquivos .spec.js

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    testDir: './e2e',
    testMatch: /.*\.spec\.js$/,
    reporter: [['list'], ['html']],
    timeout: 60000,
    use: {
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
    },
};

module.exports = config;
