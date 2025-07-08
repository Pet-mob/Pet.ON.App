const { test, expect } = require('@playwright/test');

test('Fluxo de login', async ({ page }) => {
    await page.goto('http://localhost:19006');
    // Aguarda o campo de telefone
    await expect(page.locator('input[placeholder="Telefone"]')).toBeVisible();
    await page.fill('input[placeholder="Telefone"]', '11999999999');
    await page.fill('input[placeholder="Senha"]', 'suaSenhaAqui');
    await page.click('text=Entrar');
    // Espera navegação para tela principal
    await expect(page.locator('text=Menu')).toBeVisible();
});
