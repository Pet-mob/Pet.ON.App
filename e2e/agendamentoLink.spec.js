const { test, expect } = require("@playwright/test");

test("Fluxo de agendamento via link", async ({ page }) => {
  await page.goto("http://localhost:8081");
  // Simula acesso via link de agendamento (adapte a rota se necessário)
  await page.click("text=AgendamentoLink");
  // Seleciona serviço, data, horário, preenche dados e confirma
  await expect(page.locator("text=Agendar")).toBeVisible();
  // Adapte os seletores conforme o app
});
