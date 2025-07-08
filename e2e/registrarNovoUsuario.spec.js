const { test, expect } = require('@playwright/test');

test('Fluxo de registro de novo usuário com pets', async ({ page }) => {
    await page.goto('http://localhost:19006');
    await page.click('text=Registrar');
    await expect(page.locator('input[placeholder="Nome completo"]')).toBeVisible();
    await page.fill('input[placeholder="Nome completo"]', 'Usuário Teste');
    await page.fill('input[placeholder="Telefone"]', '11999999999');
    await page.fill('input[placeholder="Email"]', 'teste@teste.com');
    await page.fill('input[placeholder="Senha"]', 'senha123');
    // Adiciona pet
    await page.click('text=Adicionar Pet');
    await page.fill('input[placeholder="Nome do Pet"]', 'Rex');
    await page.click('text=Registrar');
    await expect(page.locator('text=Login')).toBeVisible();
    // Adapte os seletores conforme o app
});
