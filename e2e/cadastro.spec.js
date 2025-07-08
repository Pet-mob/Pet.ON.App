const { test, expect } = require("@playwright/test");

test("Fluxo de cadastro de novo usuário", async ({ page }) => {
  await page.goto("http://localhost:8081");
  await page.click("text=Registrar");
  await expect(
    page.locator('input[placeholder="Nome completo"]')
  ).toBeVisible();
  await page.fill('input[placeholder="Nome completo"]', "Usuário Teste");
  await page.fill('input[placeholder="Telefone"]', "11999999999");
  await page.fill('input[placeholder="Email"]', "teste@teste.com");
  await page.fill('input[placeholder="Senha"]', "senha123");
  await page.click("text=Registrar");
  // Espera mensagem de sucesso ou navegação
  await expect(page.locator("text=Login")).toBeVisible();
});
