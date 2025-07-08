const { test, expect } = require("@playwright/test");

test("Fluxo de agendamento", async ({ page }) => {
  await page.goto("http://localhost:8081");
  // Login primeiro
  await page.fill('input[placeholder="Telefone"]', "11999999999");
  await page.fill('input[placeholder="Senha"]', "suaSenhaAqui");
  await page.click("text=Entrar");
  // Acessa tela de agendamento
  await page.click("text=Agendamento");
  // Seleciona serviço, data, horário, preenche dados do pet e confirma
  await expect(page.locator("text=Agendar")).toBeVisible();
  // (Adapte os seletores conforme o app)
});
