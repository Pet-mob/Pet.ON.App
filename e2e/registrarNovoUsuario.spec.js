const { test, expect } = require("@playwright/test");

test("Fluxo de registro de novo usuário com pets", async ({ page }) => {
  await page.goto("http://localhost:8081");

  // Ir para tela de registro
  await page.click("text=Registrar-se");

  // Preencher dados do usuário
  await expect(
    page.locator('input[placeholder="Digite seu nome"]')
  ).toBeVisible();
  await page.fill('input[placeholder="Digite seu nome"]', "Usuário Teste");
  await page.fill('input[placeholder="Digite seu email"]', "teste@teste.com");
  await page.fill('input[placeholder="(99) 99999-9999"]', "(11) 99999-9999");
  await page.fill('input[placeholder="Crie uma senha"]', "Senha@123");

  // Preencher dados do pet
  await page.fill('input[placeholder="Ex: Thor"]', "Rex");
  await page.fill('input[placeholder="Ex: Golden Retriever"]', "SRD");

  // Selecionar porte do pet
  await page.click("text=Pequeno");

  // Confirmar que o botão está habilitado
  const registrarBtn = page.getByRole("button", { name: "Registrar" });
  await expect(registrarBtn).toBeEnabled();

  // Clicar para registrar
  await registrarBtn.click();

  // Validar redirecionamento
  await expect(page.getByText("Login")).toBeVisible();
});
