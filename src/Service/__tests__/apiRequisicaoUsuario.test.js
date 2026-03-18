import apiRequisicaoUsuario from "../apiRequisicaoUsuario";

// Mock da API
jest.mock("../api");

/**
 * Testes para o serviço de Usuário
 */
describe("apiRequisicaoUsuario", () => {
  let mockApi;

  beforeAll(() => {
    mockApi = require("../api").default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    if (mockApi) {
      mockApi.post?.mockClear();
      mockApi.put?.mockClear();
      mockApi.patch?.mockClear();
      mockApi.get?.mockClear();
    }
  });

  // ──────────────────────────────────────────────
  // 🔑 validarLogin - Testes Positivos
  // ──────────────────────────────────────────────

  describe("validarLogin", () => {
    test("validarLogin_ComCredenciaisValidas_DeveRetornarToken", async () => {
      // Arrange
      const telefone = "11999999999";
      const senha = "Senha123!";
      const tokenResponse = {
        data: {
          token: "jwt_token_aqui",
          idUsuario: 1,
          nome: "João Silva",
        },
      };

      mockApi.post.mockResolvedValueOnce(tokenResponse);

      // Act
      const resultado = await apiRequisicaoUsuario.validarLogin(
        telefone,
        senha,
      );

      // Assert
      expect(resultado).toEqual(tokenResponse.data);
      expect(mockApi.post).toHaveBeenCalledWith("/Usuario/login", {
        telefone,
        senha,
      });
      expect(resultado.token).toBeDefined();
    });
  });

  // ──────────────────────────────────────────────
  // validarLogin - Testes Negativos
  // ──────────────────────────────────────────────

  describe("validarLogin - Erros", () => {
    test("validarLogin_ComSenhaInvalida_DeveLancarErro", async () => {
      // Arrange
      const telefone = "11999999999";
      const senha = "SenhaErrada";
      const erro = new Error("Credenciais inválidas");

      mockApi.post.mockRejectedValueOnce(erro);

      // Act & Assert
      await expect(
        apiRequisicaoUsuario.validarLogin(telefone, senha),
      ).rejects.toThrow("Credenciais inválidas");
    });

    test("validarLogin_ComTelefoneNaoExistente_DeveLancarErro", async () => {
      // Arrange
      const telefone = "11888888888";
      const senha = "Senha123!";
      const erro = new Error("Usuário não encontrado");

      mockApi.post.mockRejectedValueOnce(erro);

      // Act & Assert
      await expect(
        apiRequisicaoUsuario.validarLogin(telefone, senha),
      ).rejects.toThrow("Usuário não encontrado");
    });
  });

  // ──────────────────────────────────────────────
  // 🔐 alterarSenhaUsuario - Testes Positivos
  // ──────────────────────────────────────────────

  describe("alterarSenhaUsuario", () => {
    test("alterarSenhaUsuario_ComParametrosValidos_DeveAlterarSenha", async () => {
      // Arrange
      const senhaNova = "NovaSenha123!";
      const idUsuario = 1;
      const resposta = {
        data: { sucesso: true, mensagem: "Senha alterada com sucesso" },
      };

      mockApi.put.mockResolvedValueOnce(resposta);

      // Act
      const resultado = await apiRequisicaoUsuario.alterarSenhaUsuario(
        senhaNova,
        idUsuario,
      );

      // Assert
      expect(resultado).toEqual(resposta.data);
      expect(mockApi.put).toHaveBeenCalledWith(
        "/Usuario/AlterarSenhaDoUsuario",
        {
          senhaNova,
          idUsuario,
        },
      );
    });
  });

  // ──────────────────────────────────────────────
  // alterarSenhaUsuario - Testes Negativos
  // ──────────────────────────────────────────────

  describe("alterarSenhaUsuario - Erros", () => {
    test("alterarSenhaUsuario_ComUsuarioInvalido_DeveLancarErro", async () => {
      // Arrange
      const senhaNova = "NovaSenha123!";
      const idUsuario = 9999;
      const erro = new Error("Usuário não encontrado");

      mockApi.put.mockRejectedValueOnce(erro);

      // Act & Assert
      await expect(
        apiRequisicaoUsuario.alterarSenhaUsuario(senhaNova, idUsuario),
      ).rejects.toThrow("Usuário não encontrado");
    });
  });

  // ──────────────────────────────────────────────
  // ✏️ alterarUsuario - Testes Positivos
  // ──────────────────────────────────────────────

  describe("alterarUsuario", () => {
    test("alterarUsuario_ComParametrosValidos_DeveAlterarDados", async () => {
      // Arrange
      const idUsuario = 1;
      const novoNome = "Maria Silva";
      const novoTelefone = "11988888888";
      const novoEmail = "maria@example.com";

      const resposta = {
        data: {
          sucesso: true,
          mensagem: "Dados alterados com sucesso",
        },
      };

      mockApi.put.mockResolvedValueOnce(resposta);

      // Act
      const resultado = await apiRequisicaoUsuario.alterarUsuario(
        idUsuario,
        novoNome,
        novoTelefone,
        novoEmail,
      );

      // Assert
      expect(resultado).toEqual(resposta.data);
      expect(mockApi.put).toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // alterarUsuario - Testes Negativos
  // ──────────────────────────────────────────────

  describe("alterarUsuario - Erros", () => {
    test("alterarUsuario_ComEmailDuplicado_DeveLancarErro", async () => {
      // Arrange
      const idUsuario = 1;
      const novoNome = "Maria Silva";
      const novoTelefone = "11988888888";
      const novoEmail = "emailjautilizado@example.com";

      const erro = new Error("Email já utilizado");

      mockApi.put.mockRejectedValueOnce(erro);

      // Act & Assert
      await expect(
        apiRequisicaoUsuario.alterarUsuario(
          idUsuario,
          novoNome,
          novoTelefone,
          novoEmail,
        ),
      ).rejects.toThrow("Email já utilizado");
    });
  });
});
