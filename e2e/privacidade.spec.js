const { test, expect } = require('@playwright/test');

test('Fluxo de alteração de senha (privacidade)', async ({ page }) => {
    await page.goto('http://localhost:19006');
    // Login primeiro
    await page.fill('input[placeholder="Telefone"]', '11999999999');
    await page.fill('input[placeholder="Senha"]', 'suaSenhaAqui');
    await page.click('text=Entrar');
    await page.click('text=Perfil');
    await page.click('text=Privacidade');
    await expect(page.locator('text=Alterar Senha')).toBeVisible();
    // Adapte os seletores conforme o app
});
