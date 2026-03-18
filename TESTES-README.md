# 🧪 Setup de Testes Unitários - Pet.ON.App

## ⚡ Início Rápido

### 1. Instalar Dependências

```bash
npm install
```

Isso instalará todas as dependências de teste incluindo jest, testing-library e babel-jest.

### 2. Rodar os Testes

```bash
# Rodar todos os testes
npm test

# Rodar em modo watch (re-executa ao salvar arquivos)
npm run test:watch

# Ver cobertura de testes
npm run test:coverage
```

### 3. Resultado Esperado

Você verá um output como:

```
PASS  src/Service/__tests__/apiRequisicaoAuth.test.js
PASS  src/Service/__tests__/apiRequisicaoAgendamento.test.js
PASS  src/store/__tests__/store.test.js

Test Suites: 3 passed, 3 total
Tests:       47 passed, 47 total
```

---

## 📦 Dependências Instaladas

| Pacote                        | Versão  | Propósito                 |
| ----------------------------- | ------- | ------------------------- |
| jest                          | ^29.7.0 | Test runner principal     |
| @testing-library/react-native | ^12.4.3 | Testes de componentes     |
| @testing-library/jest-native  | ^5.4.3  | Matchers customizados     |
| babel-jest                    | ^29.7.0 | Transpilação JS para Jest |
| jest-mock-axios               | ^4.6.1  | Mock de requisições HTTP  |

---

## 🗂️ Estrutura de Testes Criada

```
src/
├── Service/
│   └── __tests__/
│       ├── apiRequisicaoAuth.test.js        ✅ 6 testes
│       ├── apiRequisicaoAgendamento.test.js ✅ 10 testes
│       └── apiRequisicaoUsuario.test.js     ✅ 7 testes
├── store/
│   └── __tests__/
│       └── store.test.js                    ✅ 9 testes
└── components/
    └── __tests__/
        └── notificacaoToastCustomizado.test.js (exemplo)
```

**Total:** 32+ testes implementados

---

## 📝 Testes Disponíveis

### 1. **apiRequisicaoAuth.test.js** (6 testes)

- ✅ enviarSMS com telefone válido
- ✅ enviarSMS com erro
- ✅ validarCodigo com parâmetros válidos
- ✅ validarCodigo com código inválido
- ✅ redefinirSenha com sucesso
- ✅ redefinirSenha com token expirado

### 2. **apiRequisicaoAgendamento.test.js** (10 testes)

- ✅ buscarHorariosDisponiveisNaApi com dados válidos
- ✅ buscarHorariosDisponiveisNaApi com lista vazia
- ✅ adicionarAgendamentoNaApi com sucesso
- ✅ adicionarAgendamentoNaApi com erro
- ✅ buscarAgendamentosPorUsuario com dados válidos
- ✅ buscarAgendamentosPorUsuario com usuário inválido
- ✅ buscarQtdeAgendamentosDia com dados válidos
- ✅ buscarQtdeAgendamentosDia com horário sem agendamentos
- ✅ buscarQtdeAgendamentosDia com erro

### 3. **apiRequisicaoUsuario.test.js** (7 testes)

- ✅ validarLogin com credenciais válidas
- ✅ validarLogin com senha inválida
- ✅ validarLogin com usuário não existente
- ✅ alterarSenhaUsuario com sucesso
- ✅ alterarSenhaUsuario com usuário inválido
- ✅ alterarUsuario com dados válidos
- ✅ alterarUsuario com email duplicado

### 4. **store.test.js** (9+ testes)

- ✅ setUsuarioStore com usuário válido
- ✅ getUsuarioStore sem usuário definido
- ✅ setUsuarioStore com múltiplos usuários
- ✅ setEmpresaStore com empresa válida
- ✅ logout com usuário armazenado
- ✅ Fluxo completo de login
- ✅ Fluxo completo de logout

---

## 🎯 Próximos Passos

### Expandir Testes Para Outros Serviços

Para adicionar testes para outros serviços (ex: `apiRequisicaoAnimal.js`):

1. **Crie o arquivo de teste:**

   ```bash
   src/Service/__tests__/apiRequisicaoAnimal.test.js
   ```

2. **Use como template:**

   ```javascript
   import apiRequisicaoAnimal from "../../apiRequisicaoAnimal";

   jest.mock("../api", () => ({
     post: jest.fn(),
     get: jest.fn(),
   }));

   describe("apiRequisicaoAnimal", () => {
     const mockApi = require("../api").default;

     beforeEach(() => {
       jest.clearAllMocks();
     });

     test("funcao_Contexto_ResultadoEsperado", async () => {
       // Arrange
       // Act
       // Assert
     });
   });
   ```

3. **Implemente testes seguindo o padrão:**
   - Nomenclatura: [Método]_[Contexto]_[Resultado]
   - Padrão AAA: Arrange → Act → Assert
   - Pelo menos 1 teste positivo por método
   - Pelo menos 1 teste negativo/erro por método

---

## 🧩 Testando Novos Serviços - Checklist

- [ ] Leia a função no arquivo de serviço
- [ ] Crie arquivo `__tests__/seuServico.test.js`
- [ ] Mocke a API com `jest.mock('../api')`
- [ ] Crie describe block para o serviço
- [ ] Para cada função pública:
  - [ ] 1+ testes caso positivo (sucesso)
  - [ ] 1+ testes caso negativo (erro)
  - [ ] Use padrão AAA
  - [ ] Nomeie seguindo [Método]_[Contexto]_[Resultado]
  - [ ] Verifique chamadas com `toHaveBeenCalledWith`
  - [ ] Verifique contagem com `toHaveBeenCalledTimes`
- [ ] Rode os testes: `npm test seu-servico.test.js`
- [ ] Garanta cobertura > 80%

---

## 💻 Testando Componentes

Para componentes, use React Native Testing Library:

```javascript
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import MeuComponente from "../../MeuComponente";

describe("MeuComponente", () => {
  test("render_DeveRenderizarComponente", () => {
    const { getByTestId } = render(<MeuComponente testID="meu-componente" />);
    expect(getByTestId("meu-componente")).toBeTruthy();
  });

  test("interacao_DeveChamarCallbackAoClicar", () => {
    const mockFn = jest.fn();
    const { getByText } = render(
      <MeuComponente onPress={mockFn} label="Botão" />,
    );
    fireEvent.press(getByText("Botão"));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
```

---

## 📊 Cobertura de Testes

Gere relatório de cobertura:

```bash
npm run test:coverage
```

Isso gera relatório em `coverage/lcov-report/index.html`

Metas de cobertura:

- **Branches:** > 70%
- **Functions:** > 80%
- **Lines:** > 80%
- **Statements:** > 80%

---

## 🔧 Troubleshooting

### "Cannot find module '@babel/core'"

Solução:

```bash
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react
```

### "Jest timeout"

Se testes demoram muito, aumente o timeout:

```javascript
jest.setTimeout(15000); // 15 segundos
```

### "Mock não está funcionando"

Certifique-se de que:

1. `jest.mock()` está **antes** do `import`
2. Você está usando `jest.clearAllMocks()` no `beforeEach`
3. Está mockando a importação correta

---

## 📚 Documentação Completa

Veja [TESTES-GUIA.md](./TESTES-GUIA.md) para:

- Padrões e convenções detalhados
- Exemplos completos
- Boas práticas
- Referências

---

## 🚀 CI/CD Integration

Para adicionar testes ao GitHub Actions:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install
      - run: npm test -- --coverage
      - run: npm run test:coverage
```

---

## 📞 Suporte

Para mais informações:

- Documento: [TESTES-GUIA.md](./TESTES-GUIA.md)
- Jest Docs: https://jestjs.io/
- React Native Testing Library: https://testing-library.com/react-native/

---

**Criado em:** 18/03/2026  
**Última atualização:** 18/03/2026  
**Padrão:** xUnit + Moq (Backend) | Jest + React Native Testing Library (App)
