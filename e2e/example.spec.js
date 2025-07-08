// Exemplo de teste E2E com Playwright para Expo Web
const { test, expect } = require('@playwright/test');

test('Página inicial carrega e mostra o título', async ({ page }) => {
    // Altere a URL para o endereço local do seu app Expo Web
    await page.goto('http://localhost:19006');
    // Exemplo: verifica se existe algum texto/título na tela
    await expect(page.locator('text=Pet.ON')).toBeVisible();
});
es