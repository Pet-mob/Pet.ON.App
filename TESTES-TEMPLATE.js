/**
 * TEMPLATE PARA CRIAR NOVOS TESTES
 *
 * Instruções:
 * 1. Copie este arquivo para uma nova pasta __tests__
 * 2. Renomeie para NomeDoServico.test.js
 * 3. Substitua as strings entre aspas pelos valores reais
 * 4. Implemente testes seguindo o padrão AAA
 * 5. Rode: npm test NomeDoServico.test.js
 */

// ALTERE ISSO: Importe seu serviço real
import meuServico from "../../meuServico";

/**
 * Mockar dependências externas
 * Importante: jest.mock deve estar ANTES do import do serviço
 */
jest.mock("../api", () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

/**
 * Testes para meuServico
 *
 * Arquivo testado: src/Service/meuServico.js
 *
 * Responsabilidades:
 * - Testar a função 1
 * - Testar a função 2
 * - Testar a função 3
 *
 * @author GitHub Copilot
 * @version 1.0
 */
describe("meuServico", () => {
  const mockApi = require("../api").default;

  /**
   * Executado antes de cada teste
   * Limpa todos os mocks para evitar interferência entre testes
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ──────────────────────────────────────────────
  // 📋 minhaFuncao - Testes Positivos
  // ──────────────────────────────────────────────
  // Testes que verificam o comportamento esperado quando tudo funciona

  describe("minhaFuncao", () => {
    /**
     * Teste: Caso de sucesso padrão
     *
     * Padrão: [NomeFuncao]_Com[Contexto]_Deve[Resultado]
     *
     * Contexto: Parâmetros válidos
     * Resultado: Retorna dados esperados
     */
    test("minhaFuncao_ComParametrosValidos_DeveRetornarDados", async () => {
      // ─────────────────────────────────────────
      // ARRANGE - Preparar dados e mocks
      // ─────────────────────────────────────────
      const parametro1 = "valor1";
      const parametro2 = "valor2";
      const respostaMock = {
        data: {
          id: 1,
          mensagem: "Sucesso",
        },
      };

      mockApi.post.mockResolvedValueOnce(respostaMock);

      // ─────────────────────────────────────────
      // ACT - Executar a função sendo testada
      // ─────────────────────────────────────────
      const resultado = await meuServico.minhaFuncao(parametro1, parametro2);

      // ─────────────────────────────────────────
      // ASSERT - Validar os resultados
      // ─────────────────────────────────────────
      expect(resultado).toEqual(respostaMock.data);
      expect(resultado.id).toBe(1);
      expect(mockApi.post).toHaveBeenCalledWith("/endpoint/aqui", {
        param1: parametro1,
        param2: parametro2,
      });
      expect(mockApi.post).toHaveBeenCalledTimes(1);
    });

    /**
     * Teste: Caso com dados diferentes
     */
    test("minhaFuncao_ComParametrosDiferentes_DeveProcessarCorreto", async () => {
      // Arrange
      const parametro = "outro_valor";
      const respostaMock = { data: { resultado: "ok" } };
      mockApi.post.mockResolvedValueOnce(respostaMock);

      // Act
      const resultado = await meuServico.minhaFuncao(parametro);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.resultado).toBe("ok");
    });
  });

  // ──────────────────────────────────────────────
  // minhaFuncao - Testes Negativos / Erros
  // ──────────────────────────────────────────────
  // Testes que verificam como a função se comporta quando algo dá errado

  describe("minhaFuncao - Erros", () => {
    /**
     * Teste: Tratamento de erro
     *
     * Contexto: API retorna erro
     * Resultado: Lance exceção
     */
    test("minhaFuncao_ComErroNaAPI_DeveLancarErro", async () => {
      // Arrange
      const parametro = "valor";
      const erroMock = new Error("Erro na requisição");
      mockApi.post.mockRejectedValueOnce(erroMock);

      // Act & Assert
      await expect(meuServico.minhaFuncao(parametro)).rejects.toThrow(
        "Erro na requisição",
      );

      // Verificar que a API foi chamada mesmo com erro
      expect(mockApi.post).toHaveBeenCalledTimes(1);
    });

    /**
     * Teste: Parâmetro inválido
     */
    test("minhaFuncao_ComParametroNaoDefinido_DeveLancarErro", async () => {
      // Arrange
      const erroMock = new Error("Parâmetro obrigatório não fornecido");
      mockApi.post.mockRejectedValueOnce(erroMock);

      // Act & Assert
      await expect(meuServico.minhaFuncao(undefined)).rejects.toThrow(
        "Parâmetro obrigatório não fornecido",
      );
    });
  });

  // ──────────────────────────────────────────────
  // 📋 outraFuncao - Testes Positivos
  // ──────────────────────────────────────────────

  describe("outraFuncao", () => {
    test("outraFuncao_ComParametrosValidos_DeveRetornarDados", async () => {
      // Arrange
      const id = 1;
      const respostaMock = {
        data: {
          id: 1,
          nome: "Teste",
          ativo: true,
        },
      };

      mockApi.get.mockResolvedValueOnce(respostaMock);

      // Act
      const resultado = await meuServico.outraFuncao(id);

      // Assert
      expect(resultado).toEqual(respostaMock.data);
      expect(mockApi.get).toHaveBeenCalledWith(`/endpoint/${id}`);
    });
  });

  // ──────────────────────────────────────────────
  // outraFuncao - Testes Negativos
  // ──────────────────────────────────────────────

  describe("outraFuncao - Erros", () => {
    test("outraFuncao_ComIdInvalido_DeveLancarErro", async () => {
      // Arrange
      const id = 9999;
      const erroMock = new Error("Recurso não encontrado");
      mockApi.get.mockRejectedValueOnce(erroMock);

      // Act & Assert
      await expect(meuServico.outraFuncao(id)).rejects.toThrow(
        "Recurso não encontrado",
      );
    });
  });

  // ──────────────────────────────────────────────
  // 🔄 Casos de Uso Completos
  // ──────────────────────────────────────────────
  // Testes que verificam fluxos completos (ex: criar → buscar → atualizar)

  describe("Fluxos Completos", () => {
    test("fluxoCompleto_DeveRealizarCriacaoEAtualizacao", async () => {
      // Arrange
      const entrada = { param: "valor" };
      const saida1 = { id: 1, resultado: "criado" };
      const saida2 = { id: 1, resultado: "atualizado" };

      mockApi.post.mockResolvedValueOnce({ data: saida1 });
      mockApi.put.mockResolvedValueOnce({ data: saida2 });

      // Act
      const criar = await meuServico.minhaFuncao(entrada);
      const atualizar = await meuServico.outraFuncao(criar.id);

      // Assert
      expect(criar.resultado).toBe("criado");
      expect(atualizar.resultado).toBe("atualizado");
      expect(mockApi.post).toHaveBeenCalledBefore(mockApi.put);
    });
  });
});

/**
 * RESUMO DO TEMPLATE
 *
 * Estrutura usado:
 * 1. Imports e mocks
 * 2. describe principal do serviço
 * 3. beforeEach (cleanup)
 * 4. Para cada função:
 *    a) describe positivos
 *       - Caso padrão
 *       - Casos alternativos
 *    b) describe negativos (Erros)
 *       - Erro na API
 *       - Parâmetros inválidos
 * 5. Fluxos completos
 *
 * Nomenclatura padrão:
 * test('[funcao]_Com[Contexto]_Deve[Resultado]', ...)
 *
 * Sempre usar padrão AAA:
 * - Arrange (preparar)
 * - Act (executar)
 * - Assert (validar)
 *
 * Checklist antes de commitar:
 * ✓ Testes rodam sem erro
 * ✓ Todos os testes passam
 * ✓ Coverage > 80%
 * ✓ Nomes descritivos
 * ✓ Fixtures realistas
 * ✓ Cobertura de sucesso + erro
 * ✓ Comentários quando necessário
 */
