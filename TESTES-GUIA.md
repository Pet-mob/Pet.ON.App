# Guia de Testes Unitários - Pet.ON.App

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Testes](#estrutura-de-testes)
3. [Padrões e Convenções](#padrões-e-convenções)
4. [Como Rodar Testes](#como-rodar-testes)
5. [Exemplos Práticos](#exemplos-práticos)
6. [Boas Práticas](#boas-práticas)

---

## 🎯 Visão Geral

Este projeto utiliza **Jest** como framework de testes, seguindo os mesmos padrões rigorosos utilizados no backend (xUnit + Moq).

### Tecnologias

- **Jest** - Test runner e assertion library
- **@testing-library/react-native** - Testes de componentes
- **jest-mock-axios** - Mocking de requisições HTTP

---

## 📁 Estrutura de Testes

Cada módulo deve ter uma pasta `__tests__` com seus testes:

```
src/
├── Service/
│   ├── api.js
│   ├── apiRequisicaoAuth.js
│   └── __tests__/
│       ├── api.test.js
│       ├── apiRequisicaoAuth.test.js
│       └── apiRequisicaoAgendamento.test.js
├── store/
│   ├── store.js
│   └── __tests__/
│       └── store.test.js
├── components/
│   ├── menuInferior.js
│   └── __tests__/
│       └── menuInferior.test.js
└── screens/
    ├── Login.js
    └── __tests__/
        └── Login.test.js
```

---

## 🏷️ Padrões e Convenções

### 1. Nomenclatura de Testes

Seguimos o padrão **[Método]_[Contexto]_[ResultadoEsperado]**:

```javascript
test("enviarSMS_ComTelefoneValido_DeveEnviarSMS", () => {
  // Teste aqui
});

test("validarCodigo_ComCodigoInvalido_DeveLancarErro", () => {
  // Teste aqui
});

test("logout_SemDadosArmazenados_NaoDeveLancarErro", () => {
  // Teste aqui
});
```

### 2. Organização com Regions

Use comentários para organizar testes por funcionalidade:

```javascript
// ──────────────────────────────────────────────
// 🔐 validarCodigo - Testes Positivos
// ──────────────────────────────────────────────

describe("validarCodigo", () => {
  test("validarCodigo_ComParametrosValidos_DeveValidar", () => {
    // ...
  });
});

// ──────────────────────────────────────────────
// validarCodigo - Testes Negativos
// ──────────────────────────────────────────────

describe("validarCodigo - Erros", () => {
  test("validarCodigo_ComCodigoInvalido_DeveLancarErro", () => {
    // ...
  });
});
```

### 3. Padrão AAA (Arrange-Act-Assert)

Sempre organize seus testes em três partes:

```javascript
test('descricao_contexto_resultado', () => {
  // Arrange (Preparar) - Setup dos dados e mocks
  const dados = { id: 1, nome: 'Teste' };
  mockedApi.get.mockResolvedValueOnce({ data: dados });

  // Act (Agir) - Executar a função sendo testada
  const resultado = await minhaFuncao();

  // Assert (Afirmar) - Verificar os resultados
  expect(resultado).toEqual(dados);
  expect(mockedApi.get).toHaveBeenCalledTimes(1);
});
```

---

## ▶️ Como Rodar Testes

### Scripts Disponíveis

```bash
# Rodar todos os testes uma vez
npm test

# Rodar testes em modo watch (re-executar ao salvar)
npm run test:watch

# Rodar testes com relatório de cobertura
npm run test:coverage

# Rodar teste específico com debug
npm run test:debug
```

### Rodar Testes Específicos

```bash
# Apenas um arquivo
npm test apiRequisicaoAuth.test.js

# Apenas um describe block
npm test -- --testNamePattern="enviarSMS"

# Com padrão de arquivo
npm test -- Service/
```

---

## 💡 Exemplos Práticos

### 1. Testando Serviços de API

**apiRequisicaoAuth.test.js** - Exemplo completo

```javascript
import apiRequisicaoAuth from "../../apiRequisicaoAuth";

jest.mock("../api", () => ({
  post: jest.fn(),
}));

describe("apiRequisicaoAuth", () => {
  const mockApi = require("../api").default;

  beforeEach(() => {
    jest.clearAllMocks(); // Limpar mocks antes de cada teste
  });

  test("enviarSMS_ComTelefoneValido_DeveEnviarSMS", async () => {
    // Arrange
    const telefone = "11999999999";
    const resposta = { data: { sucesso: true } };
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

  test("enviarSMS_ComErroNaRequisicao_DeveLancarErro", async () => {
    // Arrange
    const telefone = "11999999999";
    mockApi.post.mockRejectedValueOnce(new Error("Telefone inválido"));

    // Act & Assert
    await expect(apiRequisicaoAuth.enviarSMS(telefone)).rejects.toThrow(
      "Telefone inválido",
    );
  });
});
```

### 2. Testando Store (Estado Global)

**store.test.js** - Exemplo completo

```javascript
import * as store from "../../store";

describe("Store", () => {
  beforeEach(() => {
    store.logout(); // Limpar estado antes de cada teste
  });

  test("setUsuarioStore_ComUsuarioValido_DeveArmazenarUsuario", () => {
    // Arrange
    const usuario = { idUsuario: 1, nome: "João" };

    // Act
    store.setUsuarioStore(usuario);

    // Assert
    expect(store.getUsuarioStore()).toEqual(usuario);
  });

  test("logout_ComUsuarioArmazenado_DeveRemoverUsuario", () => {
    // Arrange
    const usuario = { idUsuario: 1, nome: "João" };
    store.setUsuarioStore(usuario);

    // Act
    store.logout();

    // Assert
    expect(store.getUsuarioStore()).toBeNull();
  });
});
```

### 3. Testando Componentes

Padrão básico para componentes React Native:

```javascript
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import MeuComponente from "../../MeuComponente";

describe("MeuComponente", () => {
  test("render_DeveRenderizarComponente", () => {
    // Arrange & Act
    const { getByTestId } = render(<MeuComponente testID="meu-componente" />);

    // Assert
    expect(getByTestId("meu-componente")).toBeTruthy();
  });

  test("interacao_DeveChamarCallbackAoClicar", () => {
    // Arrange
    const mockCallback = jest.fn();
    const { getByText } = render(
      <MeuComponente onPress={mockCallback} label="Clique" />,
    );

    // Act
    fireEvent.press(getByText("Clique"));

    // Assert
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🎓 Boas Práticas

### 1. Use `beforeEach` e `afterEach`

```javascript
describe("Servico", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpar todos os mocks
  });

  afterEach(() => {
    // Cleanup se necessário
  });
});
```

### 2. Mocke Dependências Externas

```javascript
jest.mock("../api", () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn().mockResolvedValue(null),
  getItem: jest.fn().mockResolvedValue(null),
}));
```

### 3. Teste Casos Positivos E Negativos

```javascript
describe("funcao", () => {
  // Testes positivos (sucesso)
  test("funcao_ComParametrosValidos_DeveRetornarResultado", () => {});

  // Testes negativos (erro)
  test("funcao_ComParametrosInvalidos_DeveLancarErro", () => {});
});
```

### 4. Use Dados Realistas

```javascript
// ✅ Bom
const usuario = {
  idUsuario: 1,
  nome: "João Silva",
  email: "joao@example.com",
  telefone: "11999999999",
};

// ❌ Evitar
const usuario = { a: 1, b: "x" };
```

### 5. Teste um Conceito Por Teste

```javascript
// ✅ Bom - Um conceito por teste
test("buscar_ComId_DeveRetornarDados", () => {});
test("buscar_ComIdInvalido_DeveLancarErro", () => {});

// ❌ Evitar - Múltiplos conceitos
test("buscar_DeveRetornarDadosOuErro", () => {});
```

### 6. Mantenha Testes Independentes

Cada teste deve ser executável isoladamente:

```javascript
// ✅ Bom - Cada teste é independente
test("teste1", () => {
  const resultado = funcao(dados1);
  expect(resultado).toBeTruthy();
});

test("teste2", () => {
  const resultado = funcao(dados2);
  expect(resultado).toBeFalsy();
});

// ❌ Evitar - Depender de ordem
test("teste1", () => {
  estado.x = 1;
});
test("teste2", () => {
  expect(estado.x).toBe(1);
}); // Depende de teste1
```

---

## 🪝 Hooks de Teste Comuns

```javascript
// Executar antes de cada teste
beforeEach(() => {
  jest.clearAllMocks();
});

// Executar depois de cada teste
afterEach(() => {
  // Cleanup
});

// Executar antes de todos os testes do describe
beforeAll(() => {
  // Setup global
});

// Executar depois de todos os testes do describe
afterAll(() => {
  // Cleanup global
});
```

---

## 📊 Assertion Comuns

```javascript
// Igualdade
expect(resultado).toBe(5); // ===
expect(resultado).toEqual({ id: 1 }); // Comparação profunda
expect(resultado).not.toBe(10); // Negação

// Veracidade
expect(valor).toBeTruthy(); // true, 1, "texto", [], {}
expect(valor).toBeFalsy(); // false, 0, "", null, undefined

// Nulidade
expect(valor).toBeNull();
expect(valor).toBeUndefined();
expect(valor).toBeDefined();

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain("item");
expect(array).toEqual([1, 2, 3]);

// Strings
expect(texto).toMatch(/regex/);
expect(texto).toContain("substring");
expect(texto).toMatch("substring");

// Números
expect(numero).toBeGreaterThan(5);
expect(numero).toBeLessThan(10);
expect(numero).toBeCloseTo(3.14, 2);

// Funções
expect(mockFunc).toHaveBeenCalled();
expect(mockFunc).toHaveBeenCalledTimes(1);
expect(mockFunc).toHaveBeenCalledWith("arg1", "arg2");

// Exceções
expect(() => funcao()).toThrow();
expect(() => funcao()).toThrow(Error);
expect(promiseFunc()).rejects.toThrow();
```

---

## 📈 Checklist para Novo Teste

- [ ] Teste tem nome descritivo seguindo [Método]_[Contexto]_[Resultado]
- [ ] Usa padrão AAA (Arrange-Act-Assert)
- [ ] Mocks são claros (beforeEach clears)
- [ ] Testa um conceito por teste
- [ ] Testa caso positivo E negativo
- [ ] Usa dados realistas
- [ ] Não depende de outros testes
- [ ] Comentários explicam o "porquê", não o "o quê"
- [ ] Assertions são específicas
- [ ] Coverage é adequado (>80%)

---

## 🔗 Referências

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://testing-library.com/react-native/)
- [Backend Tests Pattern](../Pet.ON.Api/Pet.ON.Teste/) (xUnit + Moq)

---

**Última atualização:** 18/03/2026
**Responsável:** GitHub Copilot
