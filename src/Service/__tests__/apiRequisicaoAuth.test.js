import axios from "axios";
import apiRequisicaoAuth from "../apiRequisicaoAuth";

// Mock da API
jest.mock("../api");

/**
 * Testes para o serviço de Autenticação
 * Padrão: [Metodo]_[Contexto]_[ResultadoEsperado]
 */
describe("apiRequisicaoAuth", () => {
  let mockApi;

  beforeAll(() => {
    mockApi = require("../api").default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    if (mockApi) {
      mockApi.post?.mockClear();
    }
  });

  // ──────────────────────────────────────────────
  // 📱 enviarSMS - Testes Positivos
  // ──────────────────────────────────────────────

  describe("enviarSMS", () => {
    test("enviarSMS_ComTelefoneValido_DeveEnviarSMS", async () => {
      // Arrange
      const telefone = "11999999999";
      const resposta = {
        data: { sucesso: true, mensagem: "SMS enviado" },
      };

      mockApi.post.mockResolvedValueOnce(resposta);

      // Act
      const resultado = await apiRequisicaoAuth.enviarSMS(telefone);

      // Assert
      expect(resultado).toEqual(resposta.data);
      expect(mockApi.post).toHaveBeenCalledWith("/Auth/enviar-codigo", {
        telefone: String(telefone),
      });
      expect(mockApi.post).toHaveBeenCalledTimes(1);
    });

    test("enviarSMS_ComTelefoneNumero_DeveConverterParaString", async () => {
      // Arrange
      const telefone = 11999999999;
      const resposta = { data: { sucesso: true } };

      mockApi.post.mockResolvedValueOnce(resposta);

      // Act
      await apiRequisicaoAuth.enviarSMS(telefone);

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith("/Auth/enviar-codigo", {
        telefone: "11999999999",
      });
    });
  });

  // ──────────────────────────────────────────────
  // enviarSMS - Testes Negativos
  // ──────────────────────────────────────────────

  describe("enviarSMS - Erros", () => {
    test("enviarSMS_ComErroNaRequisicao_DeveLancarErro", async () => {
      // Arrange
      const telefone = "11999999999";
      const erro = new Error("Telefone inválido");

      mockApi.post.mockRejectedValueOnce(erro);

      // Act & Assert
      await expect(apiRequisicaoAuth.enviarSMS(telefone)).rejects.toThrow(
        "Telefone inválido",
      );
    });
  });

  // ──────────────────────────────────────────────
  // 🔐 validarCodigo - Testes Positivos
  // ──────────────────────────────────────────────

  describe("validarCodigo", () => {
    test("validarCodigo_ComEmailECodigoValidos_DeveValidar", async () => {
      // Arrange
      const email = "usuario@example.com";
      const codigo = "123456";
      const resposta = {
        data: {
          sucesso: true,
          token: "token_jwt_válido",
        },
      };

      mockApi.post.mockResolvedValueOnce(resposta);

      // Act
      const resultado = await apiRequisicaoAuth.validarCodigo(email, codigo);

      // Assert
      expect(resultado).toEqual(resposta.data);
      expect(mockApi.post).toHaveBeenCalledWith("/Auth/validar-codigo", {
        email: String(email),
        codigo: String(codigo),
      });
    });

    test("validarCodigo_ComParametrosNumericosOuDiferentes_DeveConverterParaString", async () => {
      // Arrange
      const email = "teste@test.com";
      const codigo = 123456;
      const resposta = { data: { sucesso: true } };

      mockApi.post.mockResolvedValueOnce(resposta);

      // Act
      await apiRequisicaoAuth.validarCodigo(email, codigo);

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith("/Auth/validar-codigo", {
        email: "teste@test.com",
        codigo: "123456",
      });
    });
  });

  // ──────────────────────────────────────────────
  // validarCodigo - Testes Negativos
  // ──────────────────────────────────────────────

  describe("validarCodigo - Erros", () => {
    test("validarCodigo_ComCodigoInvalido_DeveLancarErro", async () => {
      // Arrange
      const email = "usuario@example.com";
      const codigo = "000000";
      const erro = new Error("Código inválido");

      mockApi.post.mockRejectedValueOnce(erro);

      // Act & Assert
      await expect(
        apiRequisicaoAuth.validarCodigo(email, codigo),
      ).rejects.toThrow("Código inválido");
    });
  });

  // ──────────────────────────────────────────────
  // 🔑 redefinirSenha - Testes Positivos
  // ──────────────────────────────────────────────

  describe("redefinirSenha", () => {
    test("redefinirSenha_ComParametrosValidos_DeveRedefinirSenha", async () => {
      // Arrange
      const email = "usuario@example.com";
      const codigo = "123456";
      const novaSenha = "NovaSegura123!";
      const resposta = {
        data: {
          sucesso: true,
          mensagem: "Senha redefinida com sucesso",
        },
      };

      mockApi.post.mockResolvedValueOnce(resposta);

      // Act
      const resultado = await apiRequisicaoAuth.redefinirSenha(
        email,
        codigo,
        novaSenha,
      );

      // Assert
      expect(resultado).toEqual(resposta.data);
      expect(mockApi.post).toHaveBeenCalledWith("/Auth/redefinir-senha", {
        email: String(email),
        codigo: String(codigo),
        novaSenha: String(novaSenha),
      });
      expect(mockApi.post).toHaveBeenCalledTimes(1);
    });
  });

  // ──────────────────────────────────────────────
  // redefinirSenha - Testes Negativos
  // ──────────────────────────────────────────────

  describe("redefinirSenha - Erros", () => {
    test("redefinirSenha_ComTokenExpirado_DeveLancarErro", async () => {
      // Arrange
      const email = "usuario@example.com";
      const codigo = "123456";
      const novaSenha = "NovaSegura123!";
      const erro = new Error("Token expirado");

      mockApi.post.mockRejectedValueOnce(erro);

      // Act & Assert
      await expect(
        apiRequisicaoAuth.redefinirSenha(email, codigo, novaSenha),
      ).rejects.toThrow("Token expirado");
    });
  });
});
