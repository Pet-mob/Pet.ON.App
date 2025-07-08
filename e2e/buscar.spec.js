const { test, expect } = require("@playwright/test");

test("Fluxo de busca/explorar empresas", async ({ page }) => {
  await page.goto("http://localhost:8081");
  await page.click("text=Explorar");
  await expect(page.locator('input[placeholder="Buscar"]')).toBeVisible();
  await page.fill('input[placeholder="Buscar"]', "Pet");
  await expect(page.locator("text=Pet shop")).toBeVisible();
  // Adapte os seletores conforme o app
});
