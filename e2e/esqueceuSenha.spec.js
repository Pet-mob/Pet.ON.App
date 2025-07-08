const { test, expect } = require("@playwright/test");

test("Fluxo de recuperação de senha", async ({ page }) => {
  await page.goto("http://localhost:8081");
  await page.click("text=Esqueceu a senha");
  await expect(page.locator('input[placeholder="Telefone"]')).toBeVisible();
  await page.fill('input[placeholder="Telefone"]', "11999999999");
  await page.click("text=Enviar código");
  // Adapte os seletores conforme o app
});
