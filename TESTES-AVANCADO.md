# 🚀 Exemplos Avançados de Testes

Guia com patterns avançados para casos complexos no Pet.ON.App

---

## 1. Testando Múltiplas Chamadas à API

```javascript
test("buscarHorarios_DeveRealizarDuasRequisicoes", async () => {
  // Arrange
  const mockApi = require("../api").default;
  mockApi.get
    .mockResolvedValueOnce({ data: [{ horario: "10:00" }] })
    .mockResolvedValueOnce({ data: [{ horario: "14:00" }] });

  // Act
  const resultado1 = await minhaFuncao();
  const resultado2 = await minhaFuncao();

  // Assert
  expect(mockApi.get).toHaveBeenCalledTimes(2);
  expect(resultado1).toEqual([{ horario: "10:00" }]);
  expect(resultado2).toEqual([{ horario: "14:00" }]);
});
```

---

## 2. Testando com Timeout

```javascript
test("buscar_ComDelayNaApi_DeveResolverComSucesso", async () => {
  // Arrange
  const mockApi = require("../api").default;
  mockApi.get.mockImplementation(
    () =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ data: { resultado: "ok" } }), 1000),
      ),
  );

  // Act
  const resultado = await minhaFuncao();

  // Assert
  expect(resultado.resultado).toBe("ok");
});
```

---

## 3. Testando Validações de Entrada

```javascript
describe("validacoes de entrada", () => {
  test("validarTelefone_ComTelefoneVazio_DeveRetornarErro", () => {
    // Arrange
    const telefone = "";

    // Act & Assert
    expect(() => validarTelefone(telefone)).toThrow("Telefone é obrigatório");
  });

  test("validarTelefone_ComTelefoneComMenosDe10Digitos_DeveRetornarErro", () => {
    // Arrange
    const telefone = "119999";

    // Act & Assert
    expect(() => validarTelefone(telefone)).toThrow(
      "Telefone deve ter 10 ou 11 dígitos",
    );
  });

  test("validarTelefone_ComTelefoneValido_DeveRetornarTelefone", () => {
    // Arrange
    const telefone = "11999999999";

    // Act
    const resultado = validarTelefone(telefone);

    // Assert
    expect(resultado).toBe(telefone);
  });
});
```

---

## 4. Testando Chamadas Sequenciais

```javascript
test("fluxoCompleto_DeveRealizarLoginEBuscarDados", async () => {
  // Arrange
  const mockApi = require("../api").default;
  const usuario = { idUsuario: 1, token: "abc123" };
  const dados = { idAgendamento: 1, data: "2026-03-20" };

  mockApi.post.mockResolvedValueOnce({ data: usuario });
  mockApi.get.mockResolvedValueOnce({ data: dados });

  // Act
  const loginResult = await login("11999999999", "senha123");
  const dadosResult = await buscarDados(loginResult.idUsuario);

  // Assert
  expect(loginResult).toEqual(usuario);
  expect(dadosResult).toEqual(dados);
  expect(mockApi.post).toHaveBeenCalledBefore(mockApi.get);
});
```

---

## 5. Mocking com Diferentes Responses

```javascript
test("buscar_ComPaginacao_DeveRetonarDadosPaginados", async () => {
  // Arrange
  const mockApi = require("../api").default;

  mockApi.get
    .mockResolvedValueOnce({
      data: {
        items: [{ id: 1 }, { id: 2 }],
        page: 1,
        total: 100,
      },
    })
    .mockResolvedValueOnce({
      data: {
        items: [{ id: 3 }, { id: 4 }],
        page: 2,
        total: 100,
      },
    });

  // Act
  const page1 = await buscarComPaginacao(1);
  const page2 = await buscarComPaginacao(2);

  // Assert
  expect(page1.page).toBe(1);
  expect(page2.page).toBe(2);
});
```

---

## 6. Testando Transformação de Dados

```javascript
test("transformarDados_ComFormatoDiferente_DeveConverterCorretamente", () => {
  // Arrange
  const dadosAPI = {
    id: 1,
    nm_usuario: "João",
    vl_idade: 30,
    dt_criacao: "2026-03-18",
  };

  // Act
  const resultado = transformarDados(dadosAPI);

  // Assert
  expect(resultado).toEqual({
    id: 1,
    nome: "João",
    idade: 30,
    dataCriacao: "2026-03-18",
  });
  expect(resultado.nome).toBe("João");
});
```

---

## 7. Testando com useEffect (para componentes)

```javascript
describe("useEffect integration", () => {
  test("componente_AoMontar_DeveBuscarDados", async () => {
    // Arrange
    const mockApi = require("../api").default;
    mockApi.get.mockResolvedValueOnce({
      data: { agendamentos: [] },
    });

    // Act
    const { getByTestId } = render(<MeuComponente />);

    // Assert - Aguardar chamada à API
    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalled();
    });
  });
});
```

---

## 8. Testando Callbacks e Props

```javascript
test("botao_AoClicar_DeveChamarCallbackComParametro", () => {
  // Arrange
  const mockCallback = jest.fn();
  const idAgendamento = 123;

  // Act
  const { getByTestId } = render(
    <BotaoCancelar
      idAgendamento={idAgendamento}
      onCancel={mockCallback}
      testID="botao-cancelar"
    />,
  );
  fireEvent.press(getByTestId("botao-cancelar"));

  // Assert
  expect(mockCallback).toHaveBeenCalledWith(idAgendamento);
  expect(mockCallback).toHaveBeenCalledTimes(1);
});
```

---

## 9. Testando Estados Modificáveis

```javascript
test("store_AoAlterarUsuario_DeveAtualizarEstadoCorreto", () => {
  // Arrange
  const usuario1 = { id: 1, nome: "João" };
  const usuario2 = { id: 2, nome: "Maria" };

  // Act
  setUsuarioStore(usuario1);
  expect(getUsuarioStore().nome).toBe("João");

  setUsuarioStore(usuario2);

  // Assert
  expect(getUsuarioStore().nome).toBe("Maria");
  expect(getUsuarioStore()).not.toEqual(usuario1);
});
```

---

## 10. Testando Erros com Mensagens Específicas

```javascript
test("api_ComErroEspecifico_DeveContermMensagem", async () => {
  // Arrange
  const mockApi = require("../api").default;
  const erroEspecifico = new Error(
    JSON.stringify({
      code: "INVALID_EMAIL",
      message: "Email não é válido",
    }),
  );

  mockApi.post.mockRejectedValueOnce(erroEspecifico);

  // Act & Assert
  try {
    await validarEmail("email_invalido");
  } catch (error) {
    const errorData = JSON.parse(error.message);
    expect(errorData.code).toBe("INVALID_EMAIL");
    expect(errorData.message).toBe("Email não é válido");
  }
});
```

---

## 11. Snapshot Testing (Use com cuidado!)

```javascript
test("componente_DeveRenderizarCorretamente", () => {
  // Arrange & Act
  const { toJSON } = render(<MeuComponente />);

  // Assert
  expect(toJSON()).toMatchSnapshot();
});
```

---

## 12. Testando com Dados Dinâmicos

```javascript
describe("parametrizado", () => {
  const testCases = [
    { telefone: "11999999999", valido: true },
    { telefone: "119999999", valido: false },
    { telefone: "", valido: false },
    { telefone: "(11) 99999-9999", valido: true },
  ];

  testCases.forEach(({ telefone, valido }) => {
    test(`validarTelefone_Com${telefone}_Deve${valido ? "Validar" : "Rejeitar"}`, () => {
      const resultado = validarTelefone(telefone);
      expect(Boolean(resultado)).toBe(valido);
    });
  });
});
```

---

## 13. Espiar Métodos do Objeto

```javascript
test("servico_DeveExecutarComSucesso", async () => {
  // Arrange
  const servico = { buscar: jest.fn().mockResolvedValue({ id: 1 }) };
  const spy = jest.spyOn(servico, "buscar");

  // Act
  await servico.buscar();

  // Assert
  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith();
  spy.mockRestore();
});
```

---

## 14. Testando LocalStorage/AsyncStorage

```javascript
import AsyncStorage from "@react-native-async-storage/async-storage";

test("salvarDados_DeveArmazemarNoAsyncStorage", async () => {
  // Arrange
  const dados = { usuario: "João", token: "abc123" };
  AsyncStorage.setItem.mockResolvedValue(null);

  // Act
  await salvarDadosUsuario(dados);

  // Assert
  expect(AsyncStorage.setItem).toHaveBeenCalledWith(
    "usuario",
    JSON.stringify(dados),
  );
});
```

---

## 15. Testando Performance

```javascript
test("funcao_DeveExecutarRapidamente", async () => {
  // Arrange
  const inicio = performance.now();

  // Act
  const resultado = await funcaoPesada();

  // Assert
  const fim = performance.now();
  const tempo = fim - inicio;

  expect(tempo).toBeLessThan(1000); // Menos de 1 segundo
  expect(resultado).toBeDefined();
});
```

---

## 📋 Template para Novo Teste

```javascript
/**
 * [DESCRIÇÃO DO QUE VOCÊ ESTÁ TESTANDO]
 *
 * Features:
 * - [Feature 1]
 * - [Feature 2]
 *
 * Dependencies:
 * - api.js
 */

import minhaFuncao from "../../minhaFuncao";

jest.mock("../api", () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
}));

describe("minhaFuncao", () => {
  const mockApi = require("../api").default;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ──────────────────────────────────────────────
  // 🎯 [Funcionalidade] - Testes Positivos
  // ──────────────────────────────────────────────

  describe("[funcionalidade]", () => {
    test("[metodo]_Com[Contexto]_Deve[Resultado]", async () => {
      // Arrange
      const entrada = {};
      const saida = {};
      mockApi.post.mockResolvedValueOnce({ data: saida });

      // Act
      const resultado = await minhaFuncao(entrada);

      // Assert
      expect(resultado).toEqual(saida);
      expect(mockApi.post).toHaveBeenCalledWith("/endpoint", entrada);
      expect(mockApi.post).toHaveBeenCalledTimes(1);
    });
  });

  // ──────────────────────────────────────────────
  // [Funcionalidade] - Testes Negativos
  // ──────────────────────────────────────────────

  describe("[funcionalidade] - Erros", () => {
    test("[metodo]_ComErro_DeveLancarErro", async () => {
      // Arrange
      const entrada = {};
      const erro = new Error("Algo deu errado");
      mockApi.post.mockRejectedValueOnce(erro);

      // Act & Assert
      await expect(minhaFuncao(entrada)).rejects.toThrow("Algo deu errado");
    });
  });
});
```

---

## 🎯 Checklist de Testes Avançados

- [ ] Testei múltiplas chamadas à API
- [ ] Testei timeout e delays
- [ ] Testei validações de entrada
- [ ] Testei fluxos completos
- [ ] Testei transformação de dados
- [ ] Testei callbacks e props
- [ ] Testei estados
- [ ] Testei erros específicos
- [ ] Testei performance quando relevante
- [ ] Testei dados dinâmicos/parametrizados

---

**Última atualização:** 18/03/2026
