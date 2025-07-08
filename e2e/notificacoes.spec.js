const { test, expect } = require('@playwright/test');

test('Fluxo de notificações', async ({ page }) => {
    await page.goto('http://localhost:19006');
    // Login primeiro
    await page.fill('input[placeholder="Telefone"]', '11999999999');
    await page.fill('input[placeholder="Senha"]', 'suaSenhaAqui');
    await page.click('text=Entrar');
    // Acessa tela de notificações
    await page.click('text=Notificações');
    await expect(page.locator('text=Sem notificações')).toBeVisible();
});
