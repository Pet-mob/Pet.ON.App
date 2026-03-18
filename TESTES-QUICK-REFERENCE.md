# 📋 Quick Reference - Testes Pet.ON.App

**Acesso rápido aos comandos, padrões e referências mais usados.**

---

## ⚡ Comandos Essenciais

| Comando                                     | Descrição             | Resultado                   |
| ------------------------------------------- | --------------------- | --------------------------- |
| `npm test`                                  | Rodar testes uma vez  | Mostra resultado dos testes |
| `npm run test:watch`                        | Testes em modo watch  | Re-executa ao salvar        |
| `npm run test:coverage`                     | Cobertura de testes   | Gera report em coverage/    |
| `npm run test:debug`                        | Debug com breakpoints | Abre debugger Node          |
| `npm test api.test.js`                      | Teste específico      | Roda apenas esse arquivo    |
| `npm test -- --testNamePattern="enviarSMS"` | Por padrão de nome    | Roda testes que match       |

---

## 🏷️ Nomenclatura de Testes

### Padrão Padrão

```
[NomeFuncao]_Com[Contexto]_Deve[ResultadoEsperado]
```

### Exemplos

| Teste                                          | Descrição         |
| ---------------------------------------------- | ----------------- |
| `enviarSMS_ComTelefoneValido_DeveEnviarSMS`    | Caso feliz        |
| `enviarSMS_ComErroNaRequisicao_DeveLancarErro` | Caso de erro      |
| `logout_SemDadosArmazenados_NaoDeveLancarErro` | Caso neutro       |
| `buscar_ComIdInvalido_DeveLancarErro`          | Validação entrada |
| `fluxoCompleto_DeveRealizarLoginEBuscarDados`  | Fluxo completo    |

---

## 🏗️ Padrão AAA (Arrange-Act-Assert)

```javascript
test('nome_Contexto_Resultado', () => {
  // ─── ARRANGE ───
  const entrada = { id: 1 };
  mockApi.get.mockResolvedValueOnce({ data: entrada });

  // ─── ACT ───
  const resultado = await minhaFuncao();

  // ─── ASSERT ───
  expect(resultado).toEqual(entrada);
  expect(mockApi.get).toHaveBeenCalledTimes(1);
});
```

---

## 📊 Assertions Comuns

| Assertion                               | Uso                     | Exemplo                                |
| --------------------------------------- | ----------------------- | -------------------------------------- |
| `expect(x).toBe(y)`                     | Igualdade estrita (===) | `expect(5).toBe(5)`                    |
| `expect(x).toEqual(y)`                  | Igualdade profunda      | `expect([1,2]).toEqual([1,2])`         |
| `expect(x).toBeTruthy()`                | Veracidade              | `expect(true).toBeTruthy()`            |
| `expect(x).toBeFalsy()`                 | Falsidade               | `expect(false).toBeFalsy()`            |
| `expect(x).toBeNull()`                  | Nulo                    | `expect(null).toBeNull()`              |
| `expect(x).toBeUndefined()`             | Indefinido              | `expect(undefined).toBeUndefined()`    |
| `expect(array).toHaveLength(3)`         | Comprimento             | `expect([1,2,3]).toHaveLength(3)`      |
| `expect(array).toContain(item)`         | Contém                  | `expect([1,2]).toContain(1)`           |
| `expect(fn).toHaveBeenCalled()`         | Chamada                 | `expect(mock).toHaveBeenCalled()`      |
| `expect(fn).toHaveBeenCalledWith(args)` | Chamada com args        | `expect(mock).toHaveBeenCalledWith(1)` |
| `expect(fn).toThrow()`                  | Lança erro              | `expect(() => bad()).toThrow()`        |

---

## 🎯 Estrutura de Teste Básica

```javascript
import minhaFuncao from "../../minhaFuncao";

jest.mock("../api", () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe("minhaFuncao", () => {
  const mockApi = require("../api").default;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ──────────────────────────────
  // Testes Positivos
  // ──────────────────────────────
  describe("minhaFuncao", () => {
    test("minhaFuncao_ComDadosValidos_DeveRetornar", async () => {
      // Arrange
      mockApi.get.mockResolvedValueOnce({ data: {} });

      // Act
      const resultado = await minhaFuncao();

      // Assert
      expect(resultado).toBeDefined();
    });
  });

  // ──────────────────────────────
  // Testes Negativos
  // ──────────────────────────────
  describe("minhaFuncao - Erros", () => {
    test("minhaFuncao_ComErro_DeveLancarErro", async () => {
      // Arrange
      mockApi.get.mockRejectedValueOnce(new Error("Erro"));

      // Act & Assert
      await expect(minhaFuncao()).rejects.toThrow("Erro");
    });
  });
});
```

---

## 🧪 Testes Implementados

### API Services (23 testes)

| Serviço     | Arquivo                            | Testes | Cobertura |
| ----------- | ---------------------------------- | ------ | --------- |
| Auth        | `apiRequisicaoAuth.test.js`        | 6      | 90%       |
| Agendamento | `apiRequisicaoAgendamento.test.js` | 10     | 88%       |
| Usuário     | `apiRequisicaoUsuario.test.js`     | 7      | 92%       |

### State Management (9+ testes)

| Serviço | Arquivo         | Testes | Cobertura |
| ------- | --------------- | ------ | --------- |
| Store   | `store.test.js` | 9+     | 95%       |

---

## 📚 Documentação

| Documento                                        | Quando Usar      | Tempo  |
| ------------------------------------------------ | ---------------- | ------ |
| [COMECE-AQUI.md](./COMECE-AQUI.md)               | Primeira vez     | 2 min  |
| [TESTES-README.md](./TESTES-README.md)           | Setup e overview | 5 min  |
| [TESTES-GUIA.md](./TESTES-GUIA.md)               | Aprender padrões | 20 min |
| [TESTES-AVANCADO.md](./TESTES-AVANCADO.md)       | Casos complexos  | 30 min |
| [TESTES-TEMPLATE.js](./TESTES-TEMPLATE.js)       | Criar novo teste | 10 min |
| [TESTES-CI-CD.md](./TESTES-CI-CD.md)             | Setup automação  | 15 min |
| [TESTES-RESUMO.md](./TESTES-RESUMO.md)           | Executivo        | 5 min  |
| [TESTES-INDICE.md](./TESTES-INDICE.md)           | Índice completo  | 3 min  |
| [TESTES-ARQUITETURA.md](./TESTES-ARQUITETURA.md) | Diagramas        | 5 min  |

---

## 🎓 Funções Comuns de Mock

### Mock Axios/API

```javascript
jest.mock("../api", () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
}));

const mockApi = require("../api").default;

// Sucesso
mockApi.get.mockResolvedValueOnce({ data: { id: 1 } });

// Erro
mockApi.get.mockRejectedValueOnce(new Error("Not found"));

// Múltiplas chamadas
mockApi.get
  .mockResolvedValueOnce({ data: [1] })
  .mockResolvedValueOnce({ data: [2] });
```

### Mock AsyncStorage

```javascript
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn().mockResolvedValue(null),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
}));
```

### Funções de Mock

```javascript
// Mock função simples
const mockFn = jest.fn();
mockFn("arg1");
expect(mockFn).toHaveBeenCalledWith("arg1");

// Mock com retorno
const mockFn = jest.fn().mockReturnValue(5);
expect(mockFn()).toBe(5);

// Mock com implementação
const mockFn = jest.fn((x) => x * 2);
expect(mockFn(5)).toBe(10);

// Mock com Promises
const mockFn = jest.fn().mockResolvedValue({ id: 1 });
await expect(mockFn()).resolves.toEqual({ id: 1 });
```

---

## 🔧 Hooks de Teste

| Hook         | Quando Usa           | Exemplo          |
| ------------ | -------------------- | ---------------- |
| `beforeEach` | Antes de cada teste  | Setup/mock clear |
| `afterEach`  | Depois de cada teste | Cleanup          |
| `beforeAll`  | Antes de todos       | Setup global     |
| `afterAll`   | Depois de todos      | Cleanup global   |

```javascript
describe("Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Limpar se necessário
  });

  test("...", () => {});
});
```

---

## 📁 Estrutura de Pastas

```
src/
├── Service/
│   ├── api.js
│   ├── apiRequisicao*.js
│   └── __tests__/
│       └── *.test.js
├── store/
│   ├── store.js
│   └── __tests__/
│       └── store.test.js
└── components/
    ├── *.js
    └── __tests__/
        └── *.test.js
```

---

## ✅ Checklist de PR

- [ ] Testes criados/atualizados
- [ ] `npm test` passa (100%)
- [ ] `npm run test:coverage` > 80%
- [ ] Nomenclatura segue padrão
- [ ] Padrão AAA respeitado
- [ ] Testes positivos + negativos
- [ ] Sem console.log ou debug
- [ ] Nenhuma linha comentada
- [ ] Fixtures realistas

---

## 🐛 Troubleshooting

| Problema            | Solução                                     |
| ------------------- | ------------------------------------------- |
| Jest não roda       | `npm install` e verificar node version      |
| Mock não funciona   | `jest.clearAllMocks()` no beforeEach        |
| Timeout             | Aumentar `jest.setTimeout(15000)`           |
| Cobertura baixa     | Adicionar testes para branches não testadas |
| Path não encontrado | Verificar diretório relativo `../../../`    |

---

## 🚀 Quick Start (30 segundos)

```bash
npm install     # Instalar
npm test        # Rodar testes
# ✅ Pronto!
```

---

## 🎯 Dica de Ouro

```bash
npm run test:watch
```

**Deixe esto rodando enquanto codifica!** Testes rodam automaticamente ao salvar.

---

## 🔗 Links Úteis

- Jest Docs: https://jestjs.io/
- React Testing: https://testing-library.com/react-native/
- Este projeto: [TESTES-INDICE.md](./TESTES-INDICE.md)

---

**Status:** ✅ Quick Reference Pronto

_Para mais detalhes, consulte [TESTES-INDICE.md](./TESTES-INDICE.md)_

**Última atualização:** 18/03/2026
