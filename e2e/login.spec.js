const { test, expect } = require("@playwright/test");

test("Fluxo de login", async ({ page }) => {
  await page.goto("http://localhost:8081");
  // Aguarda o campo de celular
  await expect(
    page.locator('input[placeholder="Digite seu celular"]')
  ).toBeVisible({ timeout: 10000 });
  await page.fill('input[placeholder="Digite seu celular"]', "16993557709");
  await page.fill('input[placeholder="Digite sua senha"]', "123");
  await page.click("text=Entrar");
  // Espera navegação para tela principal
  await expect(page.locator("text=Categorias")).toBeVisible({ timeout: 10000 });
});
