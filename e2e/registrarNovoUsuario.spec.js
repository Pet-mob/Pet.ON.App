const { test, expect } = require("@playwright/test");
test.describe("Registrar Novo Usuário", () => {
  test.beforeEach(async ({ page }) => {
    // Limpar cookies e cache antes de cada teste
    await page.context().clearCookies();
    await page.context().clearPermissions();
  });
});

test("Fluxo de registro de novo usuário com pets", async ({ page }) => {
  await page.goto("http://localhost:8081");

  // Clicar no botão de registrar-se
  await page.click("text=Registrar-se");

  // Garantir que o campo "nome" carregou
  await expect(
    page.locator('input[placeholder="Digite seu nome"]')
  ).toBeVisible();

  // Preencher dados do usuário
  await page.fill('input[placeholder="Digite seu nome"]', "Usuário Teste");
  await page.fill('input[placeholder="Digite seu email"]', "teste@teste.com");
  await page.fill('input[placeholder="(99) 99999-9999"]', "(11) 99999-9999");
  await page.fill('input[placeholder="Crie uma senha"]', "Senha@123");

  // Preencher dados do pet
  await page.fill('input[placeholder="Ex: Thor"]', "Rex");
  await page.fill('input[placeholder="Ex: Golden Retriever"]', "SRD");
  await page.click("text=Pequeno");

  // Procurar o botão "Registrar" por texto simples
  const registrarBtn = page.getByText("Registrar", { exact: true });
  await expect(registrarBtn).toBeVisible();
  await expect(registrarBtn).toBeEnabled();
  await registrarBtn.click();

  // Validar redirecionamento
  await expect(page.getByText("Login")).toBeVisible();
});
