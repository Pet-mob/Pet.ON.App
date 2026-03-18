import apiRequisicaoAgendamento from "../apiRequisicaoAgendamento";

// Mock da API
jest.mock("../api");

/**
 * Testes para o serviço de Agendamento
 */
describe("apiRequisicaoAgendamento", () => {
  let mockApi;

  beforeAll(() => {
    // Obter a API mockada APÓS o jest.mock ser aplicado
    mockApi = require("../api").default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Resetar mocks antes de cada teste
    if (mockApi) {
      mockApi.post?.mockClear();
      mockApi.get?.mockClear();
    }
  });

  // ──────────────────────────────────────────────
  // 📅 buscarHorariosDisponiveisNaApi - Testes Positivos
  // ──────────────────────────────────────────────

  describe("buscarHorariosDisponiveisNaApi", () => {
    test("buscarHorariosDisponiveisNaApi_ComParametrosValidos_DeveRetornarHorarios", async () => {
      // Arrange
      const idEmpresa = 1;
      const listaDataAgendamento = ["2026-03-20", "2026-03-21"];
      const duracaoEmMin = 60;
      const horarioAtual = "14:30";
      const horariosEsperados = [
        { hora: "14:00", disponivel: true },
        { hora: "15:00", disponivel: true },
        { hora: "16:00", disponivel: false },
      ];

      mockApi.post.mockResolvedValueOnce({ data: horariosEsperados });

      // Act
      const resultado =
        await apiRequisicaoAgendamento.buscarHorariosDisponiveisNaApi(
          idEmpresa,
          listaDataAgendamento,
          duracaoEmMin,
          horarioAtual,
        );

      // Assert
      expect(resultado).toEqual(horariosEsperados);
      expect(mockApi.post).toHaveBeenCalledWith(
        "/Agendamento/HorariosDisponiveis",
        {
          idEmpresa: 1,
          listaDataAgendamento: listaDataAgendamento,
          duracaoEmMinutos: duracaoEmMin,
          horarioAtual: horarioAtual,
        },
      );
      expect(resultado).toHaveLength(3);
    });

    test("buscarHorariosDisponiveisNaApi_ComListaVazia_DeveRetornarArrayVazio", async () => {
      // Arrange
      const idEmpresa = 1;
      const listaDataAgendamento = [];
      const duracaoEmMin = 60;
      const horarioAtual = "14:30";

      mockApi.post.mockResolvedValueOnce({ data: [] });

      // Act
      const resultado =
        await apiRequisicaoAgendamento.buscarHorariosDisponiveisNaApi(
          idEmpresa,
          listaDataAgendamento,
          duracaoEmMin,
          horarioAtual,
        );

      // Assert
      expect(resultado).toEqual([]);
      expect(resultado).toHaveLength(0);
    });
  });

  // ──────────────────────────────────────────────
  // buscarHorariosDisponiveisNaApi - Testes Negativos
  // ──────────────────────────────────────────────

  describe("buscarHorariosDisponiveisNaApi - Erros", () => {
    test("buscarHorariosDisponiveisNaApi_ComErroNaApi_DeveRetornarUndefined", async () => {
      // Arrange
      const idEmpresa = 1;
      const listaDataAgendamento = ["2026-03-20"];
      const duracaoEmMin = 60;
      const horarioAtual = "14:30";

      mockApi.post.mockRejectedValueOnce(new Error("Erro na API"));

      // Act
      const resultado =
        await apiRequisicaoAgendamento.buscarHorariosDisponiveisNaApi(
          idEmpresa,
          listaDataAgendamento,
          duracaoEmMin,
          horarioAtual,
        );

      // Assert
      expect(resultado).toBeUndefined();
    });
  });

  // ──────────────────────────────────────────────
  // 🎯 adicionarAgendamentoNaApi - Testes Positivos
  // ──────────────────────────────────────────────

  describe("adicionarAgendamentoNaApi", () => {
    test("adicionarAgendamentoNaApi_ComDadosValidos_DeveAdicionarAgendamento", async () => {
      // Arrange
      const dtoRequisicao = {
        idUsuario: 1,
        idEmpresa: 1,
        idServico: 1,
        dataAgendamento: "2026-03-20",
        horarioAgendamento: "14:00",
      };
      const respostaEsperada = {
        idAgendamento: 123,
        status: "Confirmado",
      };

      mockApi.post.mockResolvedValueOnce({ data: respostaEsperada });

      // Act
      const resultado =
        await apiRequisicaoAgendamento.adicionarAgendamentoNaApi(dtoRequisicao);

      // Assert
      expect(resultado).toEqual(respostaEsperada);
      expect(mockApi.post).toHaveBeenCalledWith("/Agendamento", dtoRequisicao);
    });
  });

  // ──────────────────────────────────────────────
  // adicionarAgendamentoNaApi - Testes Negativos
  // ──────────────────────────────────────────────

  describe("adicionarAgendamentoNaApi - Erros", () => {
    test("adicionarAgendamentoNaApi_ComErroNaApi_DeveLancarErro", async () => {
      // Arrange
      const dtoRequisicao = {
        idUsuario: 1,
        idEmpresa: 1,
      };
      const erro = new Error("Erro ao adicionar agendamento");

      mockApi.post.mockRejectedValueOnce(erro);

      // Act & Assert
      await expect(
        apiRequisicaoAgendamento.adicionarAgendamentoNaApi(dtoRequisicao),
      ).rejects.toThrow("Erro ao adicionar agendamento");
    });
  });

  // ──────────────────────────────────────────────
  // 🔍 buscarAgendamentosPorUsuario - Testes Positivos
  // ──────────────────────────────────────────────

  describe("buscarAgendamentosPorUsuario", () => {
    test("buscarAgendamentosPorUsuario_ComIdValido_DeveRetornarAgendamentos", async () => {
      // Arrange
      const idUsuarioLogado = 1;
      const agendamentosEsperados = [
        {
          idAgendamento: 1,
          dataAgendamento: "2026-03-20",
          horarioAgendamento: "14:00",
        },
        {
          idAgendamento: 2,
          dataAgendamento: "2026-03-25",
          horarioAgendamento: "10:30",
        },
      ];

      mockApi.get.mockResolvedValueOnce({ data: agendamentosEsperados });

      // Act
      const resultado =
        await apiRequisicaoAgendamento.buscarAgendamentosPorUsuario(
          idUsuarioLogado,
        );

      // Assert
      expect(resultado).toEqual(agendamentosEsperados);
      expect(mockApi.get).toHaveBeenCalledWith(
        "/Agendamento?IdUsuario=" + idUsuarioLogado,
      );
      expect(resultado).toHaveLength(2);
    });
  });

  // ──────────────────────────────────────────────
  // buscarAgendamentosPorUsuario - Testes Negativos
  // ──────────────────────────────────────────────

  describe("buscarAgendamentosPorUsuario - Erros", () => {
    test("buscarAgendamentosPorUsuario_ComUsuarioNaoExistente_DeveLancarErro", async () => {
      // Arrange
      const idUsuarioLogado = 9999;
      const erro = new Error("Usuário não encontrado");

      mockApi.get.mockRejectedValueOnce(erro);

      // Act & Assert
      await expect(
        apiRequisicaoAgendamento.buscarAgendamentosPorUsuario(idUsuarioLogado),
      ).rejects.toThrow("Usuário não encontrado");
    });
  });

  // ──────────────────────────────────────────────
  // 📊 buscarQtdeAgendamentosDia - Testes Positivos
  // ──────────────────────────────────────────────

  describe("buscarQtdeAgendamentosDia", () => {
    test("buscarQtdeAgendamentosDia_ComParametrosValidos_DeveRetornarQuantidade", async () => {
      // Arrange
      const idEmpresa = 1;
      const dataAgendamento = "2026-03-20";
      const horarioAgendamento = "14:00";
      const quantidadeEsperada = 3;

      mockApi.get.mockResolvedValueOnce({ data: quantidadeEsperada });

      // Act
      const resultado =
        await apiRequisicaoAgendamento.buscarQtdeAgendamentosDia(
          idEmpresa,
          dataAgendamento,
          horarioAgendamento,
        );

      // Assert
      expect(resultado).toBe(quantidadeEsperada);
      expect(mockApi.get).toHaveBeenCalledWith(
        `/Agendamento/QtdeAgendamentosDia?idEmpresa=${idEmpresa}&dataAgendamento=${dataAgendamento}&horario=${horarioAgendamento}`,
      );
    });

    test("buscarQtdeAgendamentosDia_ComHorarioSemAgendamentos_DeveRetornarZero", async () => {
      // Arrange
      const idEmpresa = 1;
      const dataAgendamento = "2026-03-20";
      const horarioAgendamento = "23:00";

      mockApi.get.mockResolvedValueOnce({ data: 0 });

      // Act
      const resultado =
        await apiRequisicaoAgendamento.buscarQtdeAgendamentosDia(
          idEmpresa,
          dataAgendamento,
          horarioAgendamento,
        );

      // Assert
      expect(resultado).toBe(0);
    });
  });

  // ──────────────────────────────────────────────
  // buscarQtdeAgendamentosDia - Testes Negativos
  // ──────────────────────────────────────────────

  describe("buscarQtdeAgendamentosDia - Erros", () => {
    test("buscarQtdeAgendamentosDia_ComErroNaApi_DeveRetornarUndefined", async () => {
      // Arrange
      const idEmpresa = 1;
      const dataAgendamento = "2026-03-20";
      const horarioAgendamento = "14:00";

      mockApi.get.mockRejectedValueOnce(new Error("Erro na API"));

      // Act & Assert
      await expect(
        apiRequisicaoAgendamento.buscarQtdeAgendamentosDia(
          idEmpresa,
          dataAgendamento,
          horarioAgendamento,
        ),
      ).rejects.toThrow("Erro na API");
    });
  });
});
