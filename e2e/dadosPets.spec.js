const { test, expect } = require("@playwright/test");

test("Fluxo de cadastro e edição de pets", async ({ page }) => {
  await page.goto("http://localhost:8081");
  // Login primeiro
  await page.fill('input[placeholder="Telefone"]', "11999999999");
  await page.fill('input[placeholder="Senha"]', "suaSenhaAqui");
  await page.click("text=Entrar");
  await page.click("text=Perfil");
  await page.click("text=Meus Pets");
  await expect(page.locator("text=Adicionar Pet")).toBeVisible();
  // Adapte os seletores conforme o app
});
