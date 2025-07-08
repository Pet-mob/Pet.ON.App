const { test, expect } = require("@playwright/test");

test("Fluxo de perfil do usuário", async ({ page }) => {
  await page.goto("http://localhost:8081");
  // Login primeiro
  await page.fill('input[placeholder="Telefone"]', "11999999999");
  await page.fill('input[placeholder="Senha"]', "suaSenhaAqui");
  await page.click("text=Entrar");
  // Acessa tela de perfil/usuário
  await page.click("text=Perfil");
  await expect(page.locator("text=Meus dados")).toBeVisible();
});
