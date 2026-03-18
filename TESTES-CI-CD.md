# 🚀 Integração CI/CD - GitHub Actions

Guia para integrar os testes ao pipeline de CI/CD do GitHub

---

## 📋 Pré-requisitos

- GitHub Actions já ativo no repositório ✅
- Node.js 18+ ✅
- npm ou yarn ✅

---

## 1️⃣ Criar Arquivo de Workflow

Crie o arquivo:

```
.github/workflows/tests.yml
```

Com o conteúdo abaixo:

---

## 2️⃣ Configuração Básica de Testes

### Workflow: Executar Testes em Push

```yaml
# .github/workflows/tests.yml
name: 🧪 Testes Unitários

on:
  push:
    branches: [main, develop]
    paths:
      - "src/**"
      - "package.json"
      - "jest.config.js"
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]

    steps:
      - name: 📥 Checkout código
        uses: actions/checkout@v3

      - name: 🔧 Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"

      - name: 📦 Instalar dependências
        run: npm ci

      - name: 🧪 Rodar testes
        run: npm test -- --coverage

      - name: 📊 Upload cobertura
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
```

---

## 3️⃣ Workflow com Relatório de Cobertura

```yaml
# .github/workflows/tests-coverage.yml
name: 📊 Testes + Cobertura

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test-coverage:
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v3

      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18.x"
          cache: "npm"

      - name: 📦 Instalar dependências
        run: npm ci

      - name: 🧪 Testes com cobertura
        run: npm run test:coverage

      - name: 📈 Upload codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true

      - name: 💬 Comentar cobertura em PR
        if: github.event_name == 'pull_request'
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          lcov-file: ./coverage/lcov.info
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

---

## 4️⃣ Workflow com Diferentes Cenários

```yaml
# .github/workflows/comprehensive-tests.yml
name: 🏗️ Testes Completos

on:
  push:
    branches: [main, develop, staging]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    name: Lint e Testes

    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v3

      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18.x"
          cache: "npm"

      - name: 📦 Instalar
        run: npm ci

      - name: 🧪 Testes unitários
        run: npm test -- --coverage

      - name: 📊 Análise de cobertura
        run: |
          npm run test:coverage
          if [ "$(node -e "console.log(require('fs').readFileSync('./coverage/coverage-summary.json', 'utf8'))")" ]; then
            echo "✅ Cobertura gerada com sucesso"
          fi

      - name: 📤 Upload artefatos
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage/
          retention-days: 30

      - name: 🔒 Falhar se cobertura < 70%
        run: |
          node -e "
            const coverage = require('./coverage/coverage-summary.json');
            const lines = coverage.total.lines.pct;
            if (lines < 70) {
              console.error('❌ Cobertura insuficiente:', lines + '%');
              process.exit(1);
            }
            console.log('✅ Cobertura OK:', lines + '%');
          "
```

---

## 5️⃣ Workflow com Badge de Status

Para adicionar badge no README.md:

```markdown
![Testes](https://github.com/usuario/repo/workflows/Tests/badge.svg)
```

Add ao seu [README.md](./README.md):

```yaml
# .github/workflows/badge.yml
name: 📋 Badge Status

on:
  workflow_run:
    workflows: ["🧪 Testes Unitários"]
    types: [completed]

jobs:
  badge:
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: 📋 Badge Status
        run: echo "Workflow completado"
```

---

## 6️⃣ Setup no Package.json

Certifique-se que seu `package.json` tem:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

✅ Já está configurado!

---

## 7️⃣ Estrutura Final de Workflows

```
.github/workflows/
├── tests.yml                      (básico)
├── tests-coverage.yml             (com codecov)
└── comprehensive-tests.yml        (completo)
```

---

## 🎯 Como Usar

### 1. Criar Workflow Básico

```bash
mkdir -p .github/workflows
```

Crie `tests.yml` (ver seção 2️⃣ acima)

### 2. Fazer Push

```bash
git add .github/
git commit -m "chore: add GitHub Actions tests"
git push
```

### 3. Verificar Status

Vá para: `GitHub → Actions → Seu Workflow`

### 4. Adicionar Badge (Opcional)

No [README.md](./README.md):

```markdown
## Status

[![Tests](https://github.com/seu-usuario/Pet.ON.App/workflows/Tests/badge.svg)](https://github.com/seu-usuario/Pet.ON.App/actions)
```

---

## 📊 Variáveis de Ambiente

Se precisar de variáveis (ex: URLs da API):

```yaml
env:
  CI: true
  API_URL: ${{ secrets.API_URL }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
        env:
          API_BASE_URL: ${{ secrets.API_URL }}
```

---

## 🔐 Secrets do GitHub

Se precisar adicionar secrets:

1. Vá para: **Settings → Secrets and variables → Actions**
2. Clique em **New repository secret**
3. Nome: `API_URL`
4. Valor: Sua URL

No workflow, use:

```yaml
env:
  API_URL: ${{ secrets.API_URL }}
```

---

## 🚀 Boas Práticas

### ✅ Use Checkout v3

```yaml
uses: actions/checkout@v3
```

### ✅ Use Cache para npm

```yaml
with:
  cache: "npm"
```

### ✅ Use ci ao invés de install

```yaml
run: npm ci
```

### ✅ Falahe se cobertura cair

```yaml
- run: npm run test:coverage
- run: npm test -- --coverage --coverageThreshold='{"lines":70}'
```

### ✅ Upload artefatos

```yaml
- uses: actions/upload-artifact@v3
  with:
    name: coverage
    path: coverage/
```

---

## 🐛 Troubleshooting

### Erro: "npm: not found"

Solução:

```yaml
- uses: actions/setup-node@v3
  with:
    node-version: "18.x"
    cache: "npm"
```

### Erro: "Tests timeout"

Solução:

```yaml
- run: npm test
  timeout-minutes: 10
```

### Erro: "Coverage not found"

Solução:

```yaml
- run: npm run test:coverage # Garanta que roda antes de upload
- uses: codecov/codecov-action@v3
```

---

## 📚 Próximas Etapas

- [ ] Criar primeiro workflow
- [ ] Fazer push e verificar execução
- [ ] Configurar branch protection rules
- [ ] Adicionar badge ao README
- [ ] Configurar Codecov (opcional)
- [ ] Adicionar notificações no Slack (opcional)

---

## 🔗 Referências

- GitHub Actions: https://github.com/features/actions
- Jest GitHub Action: https://github.com/marketplace/actions/jest-report
- Codecov: https://codecov.io/
- Branch Protection: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches

---

**Status:** 🟡 Tutorial pronto, implementation opcional

_Última atualização: 18/03/2026_
